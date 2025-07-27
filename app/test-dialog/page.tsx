"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function TestDialog() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dialog Test</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog to see if the basic functionality works.</DialogDescription>
          </DialogHeader>
          <p>If you can see this, the dialog is working!</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
