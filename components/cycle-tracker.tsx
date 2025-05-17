"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

// Cycle phases with their associated colors and descriptions
const cyclePhases = {
  menstrual: {
    color: "bg-blush/70",
    description: "a time for rest, reflection, and release",
  },
  follicular: {
    color: "bg-mist/70",
    description: "a time for planning, creativity, and new beginnings",
  },
  ovulatory: {
    color: "bg-yellow-100/70",
    description: "a time for connection, communication, and outward energy",
  },
  luteal: {
    color: "bg-orange-100/70",
    description: "a time for completion, evaluation, and turning inward",
  },
}

type CyclePhase = keyof typeof cyclePhases

interface CycleDay {
  date: Date
  phase: CyclePhase
  notes?: string
}

export function CycleTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [cycleDays, setCycleDays] = useState<CycleDay[]>([])
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>("menstrual")
  const [notes, setNotes] = useState("")

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous month to start the calendar on Sunday
  const startDay = monthStart.getDay() // 0 for Sunday, 1 for Monday, etc.
  const daysFromPreviousMonth = Array.from({ length: startDay }, (_, i) => addDays(monthStart, -startDay + i))

  // Add days from next month to complete the calendar grid
  const totalDaysDisplayed = daysFromPreviousMonth.length + daysInMonth.length
  const remainingDays = 42 - totalDaysDisplayed // 6 rows of 7 days
  const daysFromNextMonth = Array.from({ length: remainingDays }, (_, i) => addDays(monthEnd, i + 1))

  // Combine all days
  const allDays = [...daysFromPreviousMonth, ...daysInMonth, ...daysFromNextMonth]

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)

    // Check if this date already has data
    const existingDay = cycleDays.find((day) => isSameDay(day.date, date))

    if (existingDay) {
      setCurrentPhase(existingDay.phase)
      setNotes(existingDay.notes || "")
    } else {
      setNotes("")
    }
  }

  const handleSaveDay = () => {
    setCycleDays((prev) => {
      // Remove any existing entry for this date
      const filtered = prev.filter((day) => !isSameDay(day.date, selectedDate))

      // Add the new entry
      return [
        ...filtered,
        {
          date: selectedDate,
          phase: currentPhase,
          notes: notes.trim() || undefined,
        },
      ]
    })
  }

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <h2 className="text-xl text-center">cycle tracker</h2>
        <p className="text-sm text-slate/70 text-center">track your cyclical rhythms</p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-mist/20" onClick={handlePreviousMonth}>
                &lt;
              </Button>
              <h3 className="text-lg">{format(currentMonth, "MMMM yyyy")}</h3>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-mist/20" onClick={handleNextMonth}>
                &gt;
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Day names */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-xs text-slate/60 py-1">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {allDays.map((day, i) => {
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                const isSelected = isSameDay(day, selectedDate)
                const cycleDay = cycleDays.find((cd) => isSameDay(cd.date, day))
                const dayClass = cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer relative",
                  {
                    "text-slate/40": !isCurrentMonth,
                    "text-slate": isCurrentMonth && !isSelected,
                    "bg-mist/70 text-slate": isSelected,
                  },
                )

                return (
                  <div key={i} className="relative" onClick={() => handleDateSelect(day)}>
                    {cycleDay && (
                      <div
                        className={cn("absolute inset-0 rounded-full opacity-50", cyclePhases[cycleDay.phase].color)}
                      />
                    )}
                    <div className={dayClass}>{format(day, "d")}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate/70">selected: {format(selectedDate, "MMMM d, yyyy")}</p>
              <p className="text-sm text-slate/70">phase:</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(cyclePhases) as CyclePhase[]).map((phase) => (
                  <Button
                    key={phase}
                    variant="ghost"
                    className={cn(
                      "rounded-full text-sm capitalize",
                      currentPhase === phase
                        ? `${cyclePhases[phase].color} text-slate`
                        : "hover:bg-mist/20 text-slate/70",
                    )}
                    onClick={() => setCurrentPhase(phase)}
                  >
                    {phase}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate/70">{cyclePhases[currentPhase].description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate/70">notes:</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 p-3 rounded-xl bg-mist/20 border-none focus:outline-none resize-none text-sm"
                placeholder="how are you feeling today?"
              />
            </div>

            <Button onClick={handleSaveDay} className="w-full rounded-full bg-mist hover:bg-mist/80 text-slate">
              save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
