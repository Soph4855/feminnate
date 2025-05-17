import { Card, CardContent } from "@/components/ui/card"

interface PromptCardProps {
  prompt: string
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card className="border-none shadow-none bg-blush/30 rounded-2xl cursor-pointer hover:bg-blush/50 transition-colors duration-300">
      <CardContent className="p-6 text-center">
        <p className="italic">{prompt}</p>
      </CardContent>
    </Card>
  )
}
