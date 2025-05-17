"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SignInForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnonymousSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signIn()
      router.push("/")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email.trim()) {
      setError("Please enter your email")
      setIsLoading(false)
      return
    }

    try {
      await signIn(email, password)
      router.push("/")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="text-center">
        <h1 className="text-4xl mb-2">feminnate</h1>
        <p className="text-slate/70">a space to reflect, regulate, and reconnect</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="anonymous" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-mist/20 rounded-full p-1">
            <TabsTrigger value="anonymous" className="rounded-full data-[state=active]:bg-mist">
              anonymous
            </TabsTrigger>
            <TabsTrigger value="email" className="rounded-full data-[state=active]:bg-mist">
              with email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anonymous" className="mt-6">
            <div className="text-center space-y-6">
              <p className="text-slate/80">
                sign in anonymously and receive a nature-inspired username to protect your privacy.
              </p>
              <p className="text-slate/80">your reflections will be saved to this device.</p>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
                className="rounded-full bg-mist hover:bg-mist/80 text-slate px-8 w-full"
              >
                {isLoading ? "signing in..." : "sign in anonymously"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-none bg-mist/30 focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-none bg-mist/30 focus-visible:ring-0"
                />
                <p className="text-xs text-slate/60">password is optional for anonymous use</p>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-mist hover:bg-mist/80 text-slate px-8 w-full"
              >
                {isLoading ? "signing in..." : "sign in"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
