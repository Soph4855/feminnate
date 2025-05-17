"use client"

import { useEffect, useState } from "react"

interface BreathingAnimationProps {
  isActive?: boolean
  size?: "sm" | "md" | "lg"
  color?: string
  onComplete?: () => void
  cycles?: number
}

export function BreathingAnimation({
  isActive = true,
  size = "md",
  color = "#DDEAE4",
  onComplete,
  cycles = 3,
}: BreathingAnimationProps) {
  const [cycle, setCycle] = useState(0)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale")

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  }

  useEffect(() => {
    if (!isActive) return

    let timer: NodeJS.Timeout

    if (phase === "inhale") {
      timer = setTimeout(() => setPhase("hold"), 4000) // 4s inhale
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("exhale"), 2000) // 2s hold
    } else if (phase === "exhale") {
      timer = setTimeout(() => setPhase("rest"), 6000) // 6s exhale
    } else if (phase === "rest") {
      if (cycle < cycles - 1) {
        timer = setTimeout(() => {
          setCycle((c) => c + 1)
          setPhase("inhale")
        }, 2000) // 2s rest
      } else if (onComplete) {
        timer = setTimeout(onComplete, 2000)
      }
    }

    return () => clearTimeout(timer)
  }, [phase, cycle, cycles, isActive, onComplete])

  const getAnimationClass = () => {
    switch (phase) {
      case "inhale":
        return "animate-inhale"
      case "hold":
        return "animate-hold"
      case "exhale":
        return "animate-exhale"
      case "rest":
        return "animate-rest"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full transition-all duration-1000 ease-in-out ${getAnimationClass()}`}
        style={{
          backgroundColor: color,
          opacity: phase === "rest" ? 0.3 : 0.6,
        }}
      />
      <p className="mt-4 text-sm text-slate/70">
        {phase === "inhale" && "breathe in..."}
        {phase === "hold" && "hold..."}
        {phase === "exhale" && "breathe out..."}
        {phase === "rest" && "rest..."}
      </p>
    </div>
  )
}
