"use client"

import { Header } from "@/components/header"
import { AiCompanion } from "@/components/ai-companion"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BreathingAnimation } from "@/components/breathing-animation"

export default function AiCompanionPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-3xl py-12 px-4 flex-1">
        <h1 className="text-3xl mb-2 text-center">ai companion</h1>
        <p className="text-center text-slate/70 mb-8">a gentle presence to reflect with you</p>

        <AiCompanion />

        <div className="mt-8 text-center">
          <p className="text-sm text-slate/60">
            this companion offers reflective prompts and gentle guidance. it's not a replacement for professional mental
            health support.
          </p>
        </div>
      </div>
    </main>
  )
}
