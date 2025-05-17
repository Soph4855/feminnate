"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

// AI companion responses based on different categories
const aiResponses = {
  reflection: [
    "what sensations are you noticing in your body right now?",
    "how has your energy shifted throughout the day?",
    "where do you feel tension? where do you feel ease?",
    "what emotions have been visiting you lately?",
    "how might you offer yourself compassion in this moment?",
    "what would feel nourishing for you right now?",
    "how does your breath feel today?",
    "what patterns have you noticed in your emotional landscape?",
    "what is your body trying to tell you?",
    "how might you create more spaciousness in your day?",
    "what color would describe your current emotional state?",
    "if your body could speak, what might it say to you now?",
    "what has surprised you recently about your inner experience?",
    "how does your relationship with yourself feel today?",
    "what boundaries might need tending to in your life?",
  ],
  support: [
    "it sounds like you're experiencing a lot right now. remember that you don't have to carry it all alone.",
    "your feelings are valid, even if they're complex or contradictory.",
    "notice if you can soften around this experience, creating a little more space to breathe.",
    "what would you say to a dear friend experiencing this? can you offer yourself the same kindness?",
    "sometimes the most healing thing we can do is simply acknowledge what is true for us right now.",
    "your body holds wisdom. what might it be inviting you to honor in this moment?",
    "it's okay to not have all the answers. being present with the questions is enough.",
    "remember that all emotions move through us like weather. nothing is permanent.",
    "you're doing the brave work of showing up for yourself. that matters.",
    "consider placing a hand on your heart as a gesture of self-compassion.",
    "in moments like these, gentleness with yourself can be a profound act of care.",
    "your experience matters, even when it feels difficult to hold.",
    "sometimes simply naming what we feel can create a little more space around it.",
    "you're allowed to feel exactly as you do, without judgment or expectation.",
    "your vulnerability shows courage, not weakness.",
  ],
  guidance: [
    "perhaps try a gentle body scan, moving your awareness slowly from your feet to your head.",
    "you might find it helpful to write without judgment, letting your thoughts flow onto the page.",
    "consider taking a few moments to feel your feet on the ground, noticing the support beneath you.",
    "gentle movement can help shift stagnant energy. perhaps stretch or sway in a way that feels good.",
    "you might try naming what you're feeling with simple language: 'this is anxiety,' 'this is grief.'",
    "consider stepping outside briefly to feel the air on your skin and notice the natural world.",
    "you could try the 5-4-3-2-1 practice: notice 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.",
    "a few minutes of conscious breathing—lengthening your exhale—can help activate your parasympathetic nervous system.",
    "consider setting a gentle boundary around something that's depleting your energy.",
    "you might find it helpful to connect with someone who helps you feel seen and understood.",
    "placing your hands on different parts of your body and offering touch can be grounding.",
    "consider creating a small ritual to mark this moment or transition.",
    "humming or making soft sounds can help release tension in your throat and jaw.",
    "you might try visualizing a color or light moving through areas of discomfort in your body.",
    "sometimes drawing or moving in response to an emotion can help process it differently.",
  ],
}

type MessageType = "user" | "ai"

interface Message {
  id: string
  type: MessageType
  content: string
  timestamp: Date
}

export function AiCompanion() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "hello, i'm your gentle companion on this journey of reflection. i'm here to offer prompts, support, and guidance as you connect with your inner landscape. what's present for you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [usedResponses, setUsedResponses] = useState<Set<string>>(new Set())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get a fresh response that hasn't been used recently
  const getUniqueResponse = (category: keyof typeof aiResponses): string => {
    const responses = aiResponses[category]

    // Filter out recently used responses
    const availableResponses = responses.filter((response) => !usedResponses.has(response))

    // If we've used all responses, reset the used responses tracking
    if (availableResponses.length === 0) {
      setUsedResponses(new Set())
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // Get a random response from available ones
    const response = availableResponses[Math.floor(Math.random() * availableResponses.length)]

    // Track this response as used
    setUsedResponses((prev) => {
      const newSet = new Set(prev)
      newSet.add(response)
      // If we're tracking too many, remove oldest ones
      if (newSet.size > 10) {
        const iterator = newSet.values()
        newSet.delete(iterator.next().value)
      }
      return newSet
    })

    return response
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking and responding
    setTimeout(() => {
      // Determine response type based on message content
      let responseCategory: keyof typeof aiResponses = "reflection"

      const lowerInput = input.toLowerCase()
      if (
        lowerInput.includes("sad") ||
        lowerInput.includes("anxious") ||
        lowerInput.includes("stress") ||
        lowerInput.includes("overwhelm") ||
        lowerInput.includes("tired") ||
        lowerInput.includes("hurt") ||
        lowerInput.includes("pain") ||
        lowerInput.includes("lonely") ||
        lowerInput.includes("afraid") ||
        lowerInput.includes("scared")
      ) {
        responseCategory = "support"
      } else if (
        lowerInput.includes("how") ||
        lowerInput.includes("what should") ||
        lowerInput.includes("help") ||
        lowerInput.includes("advice") ||
        lowerInput.includes("suggest") ||
        lowerInput.includes("need") ||
        lowerInput.includes("try") ||
        lowerInput.includes("practice")
      ) {
        responseCategory = "guidance"
      }

      // Get unique response from appropriate category
      const uniqueResponse = getUniqueResponse(responseCategory)

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: "ai",
        content: uniqueResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "ai",
        content:
          "hello, i'm your gentle companion on this journey of reflection. i'm here to offer prompts, support, and guidance as you connect with your inner landscape. what's present for you today?",
        timestamp: new Date(),
      },
    ])
    setUsedResponses(new Set())
  }

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden flex flex-col h-[600px]">
      <CardHeader className="border-b border-mist/30 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-mist/50">
            <AvatarImage src="/placeholder.svg" alt="AI Companion" />
            <AvatarFallback className="bg-mist text-slate">
              <Sparkles className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg">gentle companion</h2>
            <p className="text-xs text-slate/60">here to listen and reflect with you</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto rounded-full hover:bg-mist/20" onClick={handleClearChat}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", {
                "justify-end": message.type === "user",
                "justify-start": message.type === "ai",
              })}
            >
              <div
                className={cn("max-w-[80%] rounded-2xl px-4 py-3", {
                  "bg-mist text-slate": message.type === "user",
                  "bg-blush/30 text-slate": message.type === "ai",
                })}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blush/30 text-slate">
                <div className="flex gap-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                    •
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                    •
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t border-mist/30 p-4">
        <div className="flex w-full items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="share what's on your mind..."
            className="flex-1 resize-none border-none bg-mist/20 rounded-xl p-3 focus:outline-none focus:ring-0 text-sm min-h-[60px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="rounded-full bg-mist hover:bg-mist/80 text-slate h-10 w-10 p-0"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
