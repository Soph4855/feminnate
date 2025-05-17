import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Reflection {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
  mood: string
  resonanceCount: number
  timestamp: Date
}

interface ReflectionCardProps {
  reflection: Reflection
}

export function ReflectionCard({ reflection }: ReflectionCardProps) {
  // Use more recent dates for the mock data
  const mockDate = new Date()
  mockDate.setDate(mockDate.getDate() - Math.floor(Math.random() * 5)) // Random date within the last 5 days

  // Format the timestamp to a soft format like "3 days ago" or "just now"
  const timeAgo = formatDistanceToNow(mockDate, { addSuffix: true })

  return (
    <div className="mb-12 flex flex-col items-center">
      <div className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-mist/40 to-blush/30 flex flex-col items-center justify-center p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center overflow-hidden animate-gentle-pulse">
        <h2 className="text-xl mb-2">{reflection.title}</h2>
        <p className="line-clamp-3 text-sm">{reflection.content}</p>

        <span className="mt-3 inline-block px-3 py-1 bg-white/30 backdrop-blur-sm text-slate/80 text-xs rounded-full">
          {reflection.mood}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <p className="text-xs text-slate/60 mb-2">shared {timeAgo}</p>

        <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-1 text-xs hover:bg-blush/20">
          <Heart className="h-3.5 w-3.5" />
          <span>{reflection.resonanceCount} resonated</span>
        </Button>
      </div>
    </div>
  )
}
