"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const moods = ["all", "calm", "reflective", "joyful", "tender", "heavy", "anxious", "grateful", "curious"]

interface MoodFiltersProps {
  onFilterChange: (mood: string) => void
}

export function MoodFilters({ onFilterChange }: MoodFiltersProps) {
  const [activeMood, setActiveMood] = useState("all")

  const handleMoodChange = (mood: string) => {
    setActiveMood(mood)
    onFilterChange(mood)
  }

  return (
    <div className="w-full overflow-x-auto py-4 mb-8">
      <div className="flex gap-2 min-w-max px-2">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant="ghost"
            size="sm"
            className={`rounded-full px-4 py-1 text-sm ${
              activeMood === mood ? "bg-mist text-slate" : "bg-transparent hover:bg-mist/30 text-slate/70"
            }`}
            onClick={() => handleMoodChange(mood)}
          >
            {mood}
          </Button>
        ))}
      </div>
    </div>
  )
}
