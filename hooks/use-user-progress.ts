"use client"

import { useState, useEffect, useCallback } from "react"
import { useMemberSpaceUser } from "./useMemberSpaceUser"

interface UseUserProgressReturn {
  completedSteps: number[]
  toggleStep: (stepId: number) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useUserProgress(pageType: string): UseUserProgressReturn {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: userLoading } = useMemberSpaceUser()

  // Load progress from database
  const loadProgress = useCallback(async () => {
    console.log(`📊 Loading progress for page: ${pageType}`)
    console.log(`👤 User loading: ${userLoading}, User email: ${user?.email}`)

    // If user is still loading, wait
    if (userLoading) {
      console.log("⏳ User still loading, waiting...")
      return
    }

    // If no user email, just set loading to false and continue with local storage
    if (!user?.email) {
      console.log("❌ No user email found, skipping database load")
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      console.log(`🔄 Fetching progress from API for ${user.email}...`)

      const response = await fetch(
        `/api/user-progress?userEmail=${encodeURIComponent(user.email)}&pageType=${encodeURIComponent(pageType)}`,
      )

      console.log(`📡 API Response status: ${response.status}`)

      if (!response.ok) {
        throw new Error("Failed to load progress")
      }

      const data = await response.json()
      console.log("📊 Progress data received:", data)

      const completedStepIds = data.progress.filter((p: any) => p.completed).map((p: any) => Number.parseInt(p.step_id))
      console.log("✅ Completed steps:", completedStepIds)

      setCompletedSteps(completedStepIds)
    } catch (err) {
      console.error("❌ Error loading progress:", err)
      setError("Failed to load progress")
    } finally {
      setIsLoading(false)
    }
  }, [user?.email, pageType, userLoading])

  // Save progress to database
  const saveProgress = useCallback(
    async (stepId: number, completed: boolean) => {
      console.log(`💾 Attempting to save progress: Step ${stepId}, Completed: ${completed}`)
      console.log(`👤 User email: ${user?.email}`)

      if (!user?.email) {
        console.log("❌ No user email, skipping save")
        return
      }

      try {
        setError(null)
        console.log("🔄 Sending save request to API...")

        const response = await fetch("/api/user-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
            pageType,
            stepId: stepId.toString(),
            completed,
          }),
        })

        console.log(`📡 Save API Response status: ${response.status}`)

        if (!response.ok) {
          throw new Error("Failed to save progress")
        }

        const result = await response.json()
        console.log("✅ Progress saved successfully:", result)
      } catch (err) {
        console.error("❌ Error saving progress:", err)
        setError("Failed to save progress")
        // Revert the local state change on error
        setCompletedSteps((prev) => (completed ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
      }
    },
    [user?.email, pageType],
  )

  // Toggle step completion
  const toggleStep = useCallback(
    async (stepId: number) => {
      console.log(`🔄 Toggling step ${stepId}`)
      const isCurrentlyCompleted = completedSteps.includes(stepId)
      const newCompleted = !isCurrentlyCompleted

      console.log(
        `Step ${stepId}: ${isCurrentlyCompleted ? "completed" : "incomplete"} -> ${newCompleted ? "completed" : "incomplete"}`,
      )

      // Optimistically update local state
      setCompletedSteps((prev) => (newCompleted ? [...prev, stepId] : prev.filter((id) => id !== stepId)))

      // Save to database
      await saveProgress(stepId, newCompleted)
    },
    [completedSteps, saveProgress],
  )

  // Load progress on mount and when user changes
  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  return {
    completedSteps,
    toggleStep,
    isLoading,
    error,
  }
}
