"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { BreathingAnimation } from "@/components/breathing-animation"
import Link from "next/link"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BreathingAnimation />
      </div>
    )
  }

  if (user) {
    return null // This prevents any flash of content before redirect
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-3xl py-12 px-4 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-4 text-center">feminnate</h1>
        <p className="text-center text-slate/70 mb-8 max-w-md">
          a gentle space to reflect, regulate, and reconnect with your emotional and somatic rhythms
        </p>

        <div className="flex gap-4">
          <Button asChild className="rounded-full bg-mist hover:bg-mist/80 text-slate">
            <Link href="/sign-in">begin your journey</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
