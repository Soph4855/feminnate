"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/context/auth-context"
import { BreathingAnimation } from "@/components/breathing-animation"

// Create a recent date for the mock data
const createRecentDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date
}

// Mock data for a single reflection with a recent date
const reflection = {
  id: "1",
  title: "finding stillness in chaos",
  content:
    "today i noticed how my body responds to stress. my shoulders tense, my breath becomes shallow. i took a moment to pause, to breathe deeply, to feel my feet on the ground. in that small moment, i found a pocket of peace.\n\ni've been practicing this pause throughout the day. noticing the sensations in my body without judgment. there's something powerful about simply witnessing our experience.\n\nwhen i feel overwhelmed, i return to my breath. i place a hand on my heart, another on my belly. i feel the rise and fall. i remember that i am held, that i am safe, that this moment will pass.",
  date: "may 15",
  tags: ["anxiety", "grounding", "breath"],
  mood: "reflective",
  resonanceCount: 7,
  timestamp: createRecentDate(1), // 1 day ago
}

// Mock data for comments with recent dates
const comments = [
  {
    id: "1",
    content:
      "i resonate with this deeply. i've been practicing similar pauses throughout my day. it's amazing how even a brief moment of awareness can shift everything.",
    date: "may 16",
    timestamp: createRecentDate(0), // today
  },
  {
    id: "2",
    content:
      "thank you for sharing this. i struggle with anxiety too and sometimes forget to return to my body. your words are a gentle reminder.",
    date: "may 16",
    timestamp: createRecentDate(0), // today
  },
]

export default function ReflectionPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [resonated, setResonated] = useState(false)
  const [resonanceCount, setResonanceCount] = useState(reflection.resonanceCount)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BreathingAnimation />
      </div>
    )
  }

  if (!user) {
    return null // This prevents any flash of content before redirect
  }

  const handleResonance = () => {
    if (resonated) {
      setResonanceCount((prev) => prev - 1)
    } else {
      setResonanceCount((prev) => prev + 1)
    }
    setResonated(!resonated)
  }

  // Format the timestamp to a soft format
  const timeAgo = formatDistanceToNow(reflection.timestamp, { addSuffix: true })

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-2xl py-12 px-4 flex-1">
        <Link href="/reflections" className="text-slate/70 hover:text-slate mb-6 inline-block">
          ← back to reflections
        </Link>

        <Card className="border-none shadow-none bg-transparent mb-12">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-block px-3 py-1 bg-mist/40 text-slate/80 text-xs rounded-full">
                {reflection.mood}
              </span>
              <span className="text-sm text-slate/60">shared {timeAgo}</span>
            </div>
            <h1 className="text-2xl">{reflection.title}</h1>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line">{reflection.content}</div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2">
              {reflection.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blush/50 text-slate/80 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <Button
              variant="ghost"
              className={`rounded-full flex items-center gap-1 text-sm ${
                resonated ? "text-slate bg-blush/40" : "text-slate/70 hover:bg-blush/20"
              }`}
              onClick={handleResonance}
            >
              <Heart className={`h-4 w-4 ${resonated ? "fill-current" : ""}`} />
              <span>{resonanceCount} resonated</span>
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <h2 className="text-xl">reflections</h2>

          {comments.map((comment) => (
            <Card key={comment.id} className="border-none shadow-none bg-mist/20 rounded-2xl">
              <CardContent className="pt-6">
                <p>{comment.content}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-slate/70">{formatDistanceToNow(comment.timestamp, { addSuffix: true })}</p>
              </CardFooter>
            </Card>
          ))}

          <Card className="border-none shadow-none bg-blush/20 rounded-2xl">
            <CardContent className="pt-6">
              <textarea
                className="w-full bg-transparent border-none focus:outline-none resize-none h-24"
                placeholder="share your reflection..."
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="rounded-full bg-mist hover:bg-mist/80 text-slate">share</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
