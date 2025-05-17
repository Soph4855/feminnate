"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { NewReflectionModal } from "@/components/new-reflection-modal"

// Categorized journal prompts
const prompts = {
  body: [
    "where do you feel tension in your body today?",
    "notice your breath. how is it moving through you?",
    "what sensations are present in your body right now?",
    "how does your heart feel in your chest?",
    "where do you feel most grounded in your body?",
  ],
  emotions: [
    "what emotion has been visiting you most today?",
    "where do you feel your current emotion in your body?",
    "what are you carrying that you could set down?",
    "what does your heart need right now?",
    "how has your emotional landscape shifted today?",
  ],
  cycles: [
    "how does your energy align with your cycle today?",
    "what phase of your cycle are you in, and how does it feel?",
    "what wisdom is your body offering you in this phase?",
    "how might you honor your current cyclical energy?",
    "what patterns have you noticed in your emotional cycles?",
  ],
  connection: [
    "how have you connected with yourself today?",
    "what relationship needs your attention right now?",
    "how have you shown yourself compassion recently?",
    "what boundaries do you need to honor?",
    "how might you nurture your connection to your body?",
  ],
}

type PromptCategory = "body" | "emotions" | "cycles" | "connection"

export function JournalPrompts() {
  const [category, setCategory] = useState<PromptCategory>("body")
  const [prompt, setPrompt] = useState("")

  const getRandomPrompt = (cat: PromptCategory) => {
    const categoryPrompts = prompts[cat]
    return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)]
  }

  useEffect(() => {
    setPrompt(getRandomPrompt(category))
  }, [category])

  const refreshPrompt = () => {
    setPrompt(getRandomPrompt(category))
  }

  return (
    <Card className="border-none shadow-sm bg-mist/20 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex border-b border-mist/30">
          {(["body", "emotions", "cycles", "connection"] as PromptCategory[]).map((cat) => (
            <button
              key={cat}
              className={`flex-1 py-3 text-sm ${
                category === cat ? "bg-mist/40 text-slate" : "bg-transparent text-slate/60 hover:bg-mist/20"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="p-6 text-center">
          <p className="italic text-slate/80 mb-6">{prompt}</p>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-mist/30" onClick={refreshPrompt}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>new prompt</span>
            </Button>

            <NewReflectionModal initialPrompt={prompt} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
