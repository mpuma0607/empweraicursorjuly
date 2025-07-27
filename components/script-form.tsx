"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { useUser } from "@clerk/clerk-react"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"

interface ScriptFormProps {
  initialTitle?: string
  initialScript?: string
  onSave?: () => void
}

const ScriptForm: React.FC<ScriptFormProps> = ({ initialTitle = "", initialScript = "", onSave }) => {
  const [title, setTitle] = useState(initialTitle)
  const [script, setScript] = useState(initialScript)
  const [isLoading, setIsLoading] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()
  const scriptRef = useRef<HTMLTextAreaElement>(null)
  const [isCopied, setIsCopied] = useState(false)
  const createScript = useMutation(api.scripts.createScript)
  const updateScript = useMutation(api.scripts.updateScript)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !script) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (initialTitle && initialScript) {
        // Update existing script
        await updateScript({ title, script })
        toast({
          title: "Success",
          description: "Script updated successfully!",
        })
      } else {
        // Create new script
        await createScript({ title, script })
        toast({
          title: "Success",
          description: "Script created successfully!",
        })
      }
      if (onSave) {
        onSave()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save script.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPDF = () => {
    setIsPdfLoading(true)

    const doc = new jsPDF()
    doc.autoTable({
      head: [["Title", "Script"]],
      body: [[title, script]],
    })

    doc.save(`${title}.pdf`)
    setIsPdfLoading(false)
  }

  const sendEmail = async () => {
    setIsEmailLoading(true)

    try {
      if (!user?.emailAddresses[0].emailAddress) {
        throw new Error("No email address found for the user.")
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: user?.emailAddresses[0].emailAddress,
          subject: `Your Script: ${title}`,
          text: script,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send email")
      }

      toast({
        title: "Success",
        description: "Email sent successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email.",
        variant: "destructive",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (scriptRef.current) {
      scriptRef.current.select()
      document.execCommand("copy")
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Script copied to clipboard.",
      })
      setTimeout(() => setIsCopied(false), 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialTitle ? "Edit Script" : "Create Script"}</CardTitle>
        <CardDescription>Add a title and script to get started.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Script" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="script">Script</Label>
          <Textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your script here..."
            ref={scriptRef}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={downloadPDF} disabled={isPdfLoading}>
            {isPdfLoading ? <Skeleton width={100} /> : "Download PDF"}
          </Button>
          <Button variant="secondary" onClick={sendEmail} disabled={isEmailLoading}>
            {isEmailLoading ? <Skeleton width={100} /> : "Send Email"}
          </Button>
          <Button variant="secondary" onClick={copyToClipboard} disabled={isCopied}>
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Skeleton width={100} /> : "Save Script"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ScriptForm
