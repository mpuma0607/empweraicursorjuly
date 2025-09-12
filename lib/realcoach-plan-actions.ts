"use server"

import { db } from "./database"
import { AgentProfile } from "@/app/ai-hub/realcoach-ai/page"

export interface RealCoachPlan {
  id: string
  user_id: string
  plan_name: string
  profile_data: AgentProfile
  plan_data: any
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: Date
  updated_at: Date
  completed_at: Date | null
}

export interface PlanProgress {
  id: string
  plan_id: string
  user_id: string
  week_number: number
  day_of_week: string
  activity_type: string
  activity_name: string
  completed: boolean
  completed_at: Date | null
  notes: string | null
  created_at: Date
  updated_at: Date
}

// Save a new RealCoach plan
export async function saveRealCoachPlan(
  userId: string,
  planName: string,
  profileData: AgentProfile,
  planData: any
): Promise<{ success: boolean; planId?: string; error?: string }> {
  try {
    const planId = crypto.randomUUID()
    
    await db.execute(`
      INSERT INTO realcoach_plans (id, user_id, plan_name, profile_data, plan_data, status)
      VALUES (?, ?, ?, ?, ?, 'draft')
    `, [planId, userId, planName, JSON.stringify(profileData), JSON.stringify(planData)])
    
    return { success: true, planId }
  } catch (error) {
    console.error('Error saving RealCoach plan:', error)
    return { success: false, error: 'Failed to save plan' }
  }
}

// Get user's RealCoach plans
export async function getUserRealCoachPlans(userId: string): Promise<RealCoachPlan[]> {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM realcoach_plans 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId])
    
    return (rows as any[]).map(row => ({
      ...row,
      profile_data: JSON.parse(row.profile_data),
      plan_data: JSON.parse(row.plan_data),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : null
    }))
  } catch (error) {
    console.error('Error fetching user plans:', error)
    return []
  }
}

// Get a specific RealCoach plan
export async function getRealCoachPlan(planId: string, userId: string): Promise<RealCoachPlan | null> {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM realcoach_plans 
      WHERE id = ? AND user_id = ?
    `, [planId, userId])
    
    if ((rows as any[]).length === 0) return null
    
    const row = (rows as any[])[0]
    return {
      ...row,
      profile_data: JSON.parse(row.profile_data),
      plan_data: JSON.parse(row.plan_data),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : null
    }
  } catch (error) {
    console.error('Error fetching plan:', error)
    return null
  }
}

// Update plan status
export async function updatePlanStatus(
  planId: string, 
  userId: string, 
  status: 'draft' | 'active' | 'completed' | 'archived'
): Promise<{ success: boolean; error?: string }> {
  try {
    const completedAt = status === 'completed' ? new Date() : null
    
    await db.execute(`
      UPDATE realcoach_plans 
      SET status = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [status, completedAt, planId, userId])
    
    return { success: true }
  } catch (error) {
    console.error('Error updating plan status:', error)
    return { success: false, error: 'Failed to update plan status' }
  }
}

// Save plan progress
export async function savePlanProgress(
  planId: string,
  userId: string,
  weekNumber: number,
  dayOfWeek: string,
  activityType: string,
  activityName: string,
  completed: boolean,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const completedAt = completed ? new Date() : null
    
    await db.execute(`
      INSERT INTO realcoach_plan_progress 
      (plan_id, user_id, week_number, day_of_week, activity_type, activity_name, completed, completed_at, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      completed = VALUES(completed),
      completed_at = VALUES(completed_at),
      notes = VALUES(notes),
      updated_at = CURRENT_TIMESTAMP
    `, [planId, userId, weekNumber, dayOfWeek, activityType, activityName, completed, completedAt, notes || null])
    
    return { success: true }
  } catch (error) {
    console.error('Error saving plan progress:', error)
    return { success: false, error: 'Failed to save progress' }
  }
}

// Get plan progress for a specific week
export async function getPlanProgress(
  planId: string,
  userId: string,
  weekNumber: number
): Promise<PlanProgress[]> {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM realcoach_plan_progress 
      WHERE plan_id = ? AND user_id = ? AND week_number = ?
      ORDER BY day_of_week, activity_type
    `, [planId, userId, weekNumber])
    
    return (rows as any[]).map(row => ({
      ...row,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : null
    }))
  } catch (error) {
    console.error('Error fetching plan progress:', error)
    return []
  }
}

// Get overall plan progress summary
export async function getPlanProgressSummary(planId: string, userId: string): Promise<{
  totalActivities: number
  completedActivities: number
  completionRate: number
  weeklyProgress: { week: number; completed: number; total: number }[]
}> {
  try {
    const [rows] = await db.execute(`
      SELECT 
        week_number,
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
      FROM realcoach_plan_progress 
      WHERE plan_id = ? AND user_id = ?
      GROUP BY week_number
      ORDER BY week_number
    `, [planId, userId])
    
    const weeklyProgress = (rows as any[]).map(row => ({
      week: row.week_number,
      completed: row.completed,
      total: row.total
    }))
    
    const totalActivities = weeklyProgress.reduce((sum, week) => sum + week.total, 0)
    const completedActivities = weeklyProgress.reduce((sum, week) => sum + week.completed, 0)
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0
    
    return {
      totalActivities,
      completedActivities,
      completionRate: Math.round(completionRate * 100) / 100,
      weeklyProgress
    }
  } catch (error) {
    console.error('Error fetching plan progress summary:', error)
    return {
      totalActivities: 0,
      completedActivities: 0,
      completionRate: 0,
      weeklyProgress: []
    }
  }
}
