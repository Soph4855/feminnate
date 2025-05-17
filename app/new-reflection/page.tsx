import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function NewReflectionPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-2xl py-12 px-4 flex-1">
        <Link href="/" className="text-slate/70 hover:text-slate mb-6 inline-block">
          ← back to reflections
        </Link>

        <h1 className="text-2xl mb-6">new reflection</h1>

        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="pb-2">
            <Input
              placeholder="title..."
              className="text-xl font-serif border-none bg-mist/20 focus-visible:ring-0 rounded-xl h-12"
            />
          </CardHeader>
          <CardContent>
            <div className="bg-mist/20 rounded-xl p-4 min-h-[200px]">
              <textarea
                className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[200px]"
                placeholder="what are you noticing in your body, heart, and mind today?"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div>
              <p className="text-sm mb-2">tags (separate with commas)</p>
              <Input
                placeholder="anxiety, breath, grounding..."
                className="border-none bg-blush/30 focus-visible:ring-0 rounded-xl"
              />
            </div>
            <div className="flex gap-4 self-end">
              <Button variant="ghost" className="rounded-full hover:bg-mist/20 text-slate" asChild>
                <Link href="/">cancel</Link>
              </Button>
              <Button className="rounded-full bg-mist hover:bg-mist/80 text-slate" asChild>
                <Link href="/">share</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
