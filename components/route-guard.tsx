"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { BreathingAnimation } from "@/components/breathing-animation"

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Check auth on initial load
    authCheck()

    // Set up a listener for route changes
    const handleRouteChange = () => authCheck()

    // Clean up event listener
    return () => {
      // Remove listener if component unmounts
    }

    // Auth check function
    function authCheck() {
      if (!isLoading) {
        if (!user) {
          setAuthorized(false)
          router.push("/sign-in")
        } else {
          setAuthorized(true)
        }
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BreathingAnimation />
      </div>
    )
  }

  if (!authorized) {
    return null // This prevents any flash of content before redirect
  }

  return <>{children}</>
}
