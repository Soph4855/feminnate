"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { JournalPrompts } from "@/components/journal-prompts"
import { CycleTracker } from "@/components/cycle-tracker"
import { BreathingAnimation } from "@/components/breathing-animation"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Sparkles, Activity } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
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
      <div className="container max-w-5xl py-12 px-4 flex-1">
        <h1 className="text-3xl mb-2 text-center">welcome, {user.username}</h1>
        <p className="text-center text-slate/70 mb-12">your personal space for reflection</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <JournalPrompts />

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <h2 className="text-xl text-center">breathing space</h2>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <BreathingAnimation size="md" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-mist/20">
              <CardHeader className="pb-2">
                <h2 className="text-xl text-center">body awareness</h2>
              </CardHeader>
              <CardContent className="text-center py-4">
                <p className="text-sm text-slate/80 mb-4">map sensations in your body and explore how they connect</p>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button asChild className="rounded-full bg-mist hover:bg-mist/80 text-slate">
                  <Link href="/body-awareness" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>open body map</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-blush/20">
              <CardHeader className="pb-2">
                <h2 className="text-xl text-center">ai companion</h2>
              </CardHeader>
              <CardContent className="text-center py-4">
                <p className="text-sm text-slate/80 mb-4">
                  connect with your gentle ai companion for reflection and support
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button asChild className="rounded-full bg-mist hover:bg-mist/80 text-slate">
                  <Link href="/ai-companion" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>open companion</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <CycleTracker />
          </div>
        </div>
      </div>
    </main>
  )
}
