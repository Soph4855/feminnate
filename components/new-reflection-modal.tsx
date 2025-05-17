"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const moods = ["calm", "reflective", "joyful", "tender", "heavy", "anxious", "grateful", "curious"]

interface NewReflectionModalProps {
  initialPrompt?: string
}

export function NewReflectionModal({ initialPrompt = "" }: NewReflectionModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [tags, setTags] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (initialPrompt && open) {
      setContent(initialPrompt + "\n\n")
    }
  }, [initialPrompt, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the submission
    console.log({ title, content, mood, tags, user: user?.username })
    // Reset form
    setTitle("")
    setContent("")
    setMood("")
    setTags("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-mist hover:bg-mist/80 text-slate gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>new reflection</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-none bg-bone shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">share a reflection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-full border-none bg-mist/30 focus:ring-0 rounded-xl">
                <SelectValue placeholder="how are you feeling?" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none bg-bone">
                {moods.map((m) => (
                  <SelectItem key={m} value={m} className="focus:bg-mist/30">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-mist/30 focus-visible:ring-0 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="what are you noticing in your body, heart, and mind today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] border-none bg-mist/30 focus-visible:ring-0 rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Input
              placeholder="tags (separate with commas)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-none bg-blush/30 focus-visible:ring-0 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full hover:bg-mist/20 text-slate"
              onClick={() => setOpen(false)}
            >
              cancel
            </Button>
            <Button type="submit" className="rounded-full bg-mist hover:bg-mist/80 text-slate">
              share
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
