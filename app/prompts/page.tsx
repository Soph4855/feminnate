import { Header } from "@/components/header"
import { PromptCard } from "@/components/prompt-card"

// Mock data for prompts
const prompts = [
  "what sensations are present in your body right now?",
  "describe a moment today when you felt fully present",
  "what emotions have been visiting you lately?",
  "how has your energy shifted throughout the day?",
  "what patterns have you noticed in your emotional landscape?",
  "where do you feel tension? where do you feel ease?",
  "what is your body trying to tell you?",
  "how does your breath feel today?",
  "what would feel nourishing for you right now?",
]

export default function PromptsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-3xl py-12 px-4 flex-1">
        <h1 className="text-3xl mb-8 text-center">reflection prompts</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {prompts.map((prompt, index) => (
            <PromptCard key={index} prompt={prompt} />
          ))}
        </div>
      </div>
    </main>
  )
}
