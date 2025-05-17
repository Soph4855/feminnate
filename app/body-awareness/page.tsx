"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { BodyMap } from "@/components/body-map"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { BreathingAnimation } from "@/components/breathing-animation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Marker {
  id: string
  part: string
  x: number
  y: number
  note?: string
  intensity?: number
}

export default function BodyAwarenessPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [markers, setMarkers] = useState<Marker[]>([])
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null)
  const [notes, setNotes] = useState("")
  const [saved, setSaved] = useState(false)
  const [view, setView] = useState<"front" | "back">("front")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BreathingAnimation />
      </div>
    )
  }

  if (!user) {
    return null // This prevents any flash of content before redirect
  }

  const handleMarkerAdded = (marker: Marker) => {
    setMarkers((prev) => [...prev, marker])
    setActiveMarker(marker)
    setNotes("")
  }

  const handleMarkerSelected = (marker: Marker) => {
    setActiveMarker(marker)
    setNotes(marker.note || "")
  }

  const handleMarkerRemoved = (markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId))
    if (activeMarker && activeMarker.id === markerId) {
      setActiveMarker(null)
      setNotes("")
    }
  }

  const handleSaveNotes = () => {
    if (!activeMarker) return

    setMarkers((prev) => prev.map((m) => (m.id === activeMarker.id ? { ...m, note: notes } : m)))

    setActiveMarker((prev) => (prev ? { ...prev, note: notes } : null))

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveBodyMap = () => {
    // In a real app, this would save to a database
    console.log("Saving body map:", markers)

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="min-h-screen flex flex-col bg-bone">
      <Header />
      <div className="container max-w-4xl py-12 px-4 flex-1">
        <h1 className="text-3xl mb-2 text-center">body awareness</h1>
        <p className="text-center text-slate/70 mb-8">tap to mark sensations • hold to see connections</p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-[#f5efdf]/80">
            <CardHeader className="pb-2">
              <h2 className="text-xl text-center">vitruvian body map</h2>
              <div className="flex justify-center mt-2">
                <Tabs defaultValue="front" className="w-full max-w-[200px]">
                  <TabsList className="grid w-full grid-cols-2 bg-mist/20 rounded-full p-1">
                    <TabsTrigger
                      value="front"
                      className="rounded-full data-[state=active]:bg-mist"
                      onClick={() => setView("front")}
                    >
                      anterior
                    </TabsTrigger>
                    <TabsTrigger
                      value="back"
                      className="rounded-full data-[state=active]:bg-mist"
                      onClick={() => setView("back")}
                    >
                      posterior
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <Tabs defaultValue="front" className="w-full">
                <TabsContent value="front" className="mt-0">
                  <BodyMap
                    onMarkerAdded={handleMarkerAdded}
                    onMarkerRemoved={handleMarkerRemoved}
                    onMarkerSelected={handleMarkerSelected}
                    initialMarkers={markers.filter((m) => m.part !== "upperBack" && m.part !== "lowerBack")}
                  />
                </TabsContent>
                <TabsContent value="back" className="mt-0">
                  <p className="text-center text-slate/70 italic py-8">posterior view coming soon...</p>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button onClick={handleSaveBodyMap} className="rounded-full bg-mist hover:bg-mist/80 text-slate">
                {saved ? "saved" : "save map"}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <h2 className="text-xl text-center">sensations</h2>
              </CardHeader>
              <CardContent className="py-4">
                {activeMarker ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate/70">what are you noticing in your {activeMarker.part}?</p>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="describe the sensation, emotion, or awareness..."
                      className="min-h-[150px] border-none bg-mist/20 focus-visible:ring-0 rounded-xl resize-none"
                    />
                    <Button
                      onClick={handleSaveNotes}
                      className="rounded-full bg-mist hover:bg-mist/80 text-slate w-full"
                    >
                      {saved ? "saved" : "save notes"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate/60 italic">tap on the body map to note a sensation</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-blush/20">
              <CardHeader className="pb-2">
                <h2 className="text-xl text-center">guidance</h2>
              </CardHeader>
              <CardContent className="py-4">
                <ul className="space-y-3 text-sm text-slate/80">
                  <li>• notice sensations without judgment</li>
                  <li>• observe qualities: temperature, texture, movement</li>
                  <li>• hold to see how sensations connect in your body</li>
                  <li>• tap on stars to select and add notes</li>
                  <li>• use the "show connections" button to see all relationships</li>
                  <li>• breathe into areas of tension or awareness</li>
                  <li>• approach with curiosity rather than trying to change</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
