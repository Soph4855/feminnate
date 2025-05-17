"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ReflectionList } from "@/components/reflection-list"
import { useAuth } from "@/context/auth-context"
import { BreathingAnimation } from "@/components/breathing-animation"

export default function ReflectionsPage() {
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
        <h1 className="text-3xl mb-8 text-center">reflections</h1>
        <ReflectionList />
      </div>
    </main>
  )
}
