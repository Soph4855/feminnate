"use client"

import { useState } from "react"
import Link from "next/link"
import { ReflectionCard } from "@/components/reflection-card"
import { MoodFilters } from "@/components/mood-filters"
import { EndOfScroll } from "@/components/end-of-scroll"

// Create recent timestamps for mock data
const now = new Date()
const createRecentDate = (daysAgo: number) => {
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  return date
}

// Mock data for reflections with added fields and recent dates
const reflections = [
  {
    id: "1",
    title: "finding stillness in chaos",
    content:
      "today i noticed how my body responds to stress. my shoulders tense, my breath becomes shallow. i took a moment to pause, to breathe deeply, to feel my feet on the ground. in that small moment, i found a pocket of peace.",
    date: "may 15",
    tags: ["anxiety", "grounding", "breath"],
    mood: "reflective",
    resonanceCount: 7,
    timestamp: createRecentDate(1), // 1 day ago
  },
  {
    id: "2",
    title: "cycles and seasons",
    content:
      "i've been tracking my cycle for three months now. i'm beginning to see patterns in my energy, my creativity, my emotions. there's wisdom in these rhythms if i listen closely.",
    date: "may 12",
    tags: ["cycle", "patterns", "wisdom"],
    mood: "curious",
    resonanceCount: 12,
    timestamp: createRecentDate(2), // 2 days ago
  },
  {
    id: "3",
    title: "honoring grief",
    content:
      "grief visits me in waves. today it washed over me unexpectedly. instead of pushing it away, i let myself feel it fully. there's a tenderness in allowing ourselves to be exactly where we are.",
    date: "may 8",
    tags: ["grief", "emotions", "presence"],
    mood: "heavy",
    resonanceCount: 15,
    timestamp: createRecentDate(3), // 3 days ago
  },
  {
    id: "4",
    title: "morning light",
    content:
      "i woke before the sun today. watched the sky shift from indigo to lavender to gold. there's something sacred about witnessing the day's beginning. my body feels alive with possibility.",
    date: "may 5",
    tags: ["morning", "presence", "joy"],
    mood: "joyful",
    resonanceCount: 9,
    timestamp: createRecentDate(4), // 4 days ago
  },
]

export function ReflectionList() {
  const [filteredReflections, setFilteredReflections] = useState(reflections)

  const handleFilterChange = (mood: string) => {
    if (mood === "all") {
      setFilteredReflections(reflections)
    } else {
      setFilteredReflections(reflections.filter((r) => r.mood === mood))
    }
  }

  return (
    <div>
      <MoodFilters onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReflections.map((reflection) => (
          <Link key={reflection.id} href={`/reflection/${reflection.id}`}>
            <ReflectionCard reflection={reflection} />
          </Link>
        ))}
      </div>

      <EndOfScroll />
    </div>
  )
}
