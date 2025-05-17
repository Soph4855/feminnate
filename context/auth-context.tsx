"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Generate poetic, nature-inspired usernames
const firstWords = [
  "gentle",
  "quiet",
  "soft",
  "misty",
  "tender",
  "dawn",
  "dusk",
  "moon",
  "river",
  "meadow",
  "autumn",
  "spring",
  "summer",
  "winter",
  "forest",
]

const secondWords = [
  "breeze",
  "petal",
  "leaf",
  "rain",
  "cloud",
  "whisper",
  "echo",
  "shadow",
  "light",
  "wave",
  "bloom",
  "seed",
  "root",
  "branch",
  "stone",
]

function generateUsername() {
  const first = firstWords[Math.floor(Math.random() * firstWords.length)]
  const second = secondWords[Math.floor(Math.random() * secondWords.length)]
  return `${first}${second}`
}

type User = {
  id: string
  username: string
  email?: string
  picture?: string
  createdAt: string
  preferences?: {
    theme?: string
    notifications?: boolean
  }
}

type AuthContextType = {
  user: User | null
  signInWithGoogle: () => Promise<void>
  signOut: () => void
  isLoading: boolean
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("feminnate-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signInWithGoogle = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would use the Google OAuth flow
      // For now, we'll simulate a successful Google sign-in

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create a mock Google user
      const newUser = {
        id: crypto.randomUUID(),
        username: generateUsername(),
        email: "user@example.com", // In a real app, this would come from Google
        picture: "https://placeholder.svg?height=40&width=40", // In a real app, this would be the Google profile picture
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "default",
          notifications: false,
        },
      }

      // Store in localStorage
      localStorage.setItem("feminnate-user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("feminnate-user")
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    localStorage.setItem("feminnate-user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
