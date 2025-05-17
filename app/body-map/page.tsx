// app/body-awareness/page.tsx
"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function BodyAwarenessPage() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(0);
  const [insight, setInsight] = useState<string | null>(null);

  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
    setIntensity(0); // Reset intensity when selecting a new area
    setInsight(null);
  };

  const handleMouseDown = () => {
    let start = Date.now();
    const interval = setInterval(() => {
      setIntensity(Math.min(10, Math.floor((Date.now() - start) / 300)));
    }, 300);

    const stop = () => {
      clearInterval(interval);
      document.removeEventListener("mouseup", stop);
      generateInsight(selectedArea, intensity);
    };

    document.addEventListener("mouseup", stop);
  };

  const generateInsight = (area: string | null, level: number) => {
    if (!area) return;
    // Placeholder insights (replace with real data or AI call)
    const insights: Record<string, string> = {
      shoulder: "Shoulder pain may be linked to stress, posture issues, or tension in the neck and upper back.",
      back: "Back pain often co-occurs with tension, poor sleep, or emotional holding.",
      feet: "Foot pain can reflect grounding challenges or imbalances in posture.",
    };
    setInsight(insights[area] || "We’re still learning more about this area. Check back soon!");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-3xl py-12 px-4 flex-1">
        <h1 className="text-3xl mb-4 text-center">body awareness</h1>
        <p className="text-center text-slate/70 mb-12">
          tap and hold a part of the body to explore your sensations and related insights
        </p>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-mist/20">
          <CardHeader className="pb-2 text-center">
            <h2 className="text-xl">body map</h2>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            {/* Simplified clickable zones */}
            <div className="relative w-[200px] h-[400px]">
              <div
                className="absolute top-[20%] left-[40%] w-[40px] h-[40px] bg-blush/40 rounded-full cursor-pointer"
                onClick={() => handleAreaClick("shoulder")}
                onMouseDown={handleMouseDown}
              />
              <div
                className="absolute top-[50%] left-[45%] w-[40px] h-[40px] bg-blush/40 rounded-full cursor-pointer"
                onClick={() => handleAreaClick("back")}
                onMouseDown={handleMouseDown}
              />
              <div
                className="absolute top-[80%] left-[40%] w-[40px] h-[40px] bg-blush/40 rounded-full cursor-pointer"
                onClick={() => handleAreaClick("feet")}
                onMouseDown={handleMouseDown}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            {selectedArea && (
              <>
                <p className="text-sm text-slate/70">
                  You selected: <strong>{selectedArea}</strong> with intensity level {intensity}
                </p>
                {insight && (
                  <div className="bg-white/20 p-4 rounded-xl text-center max-w-md">
                    <p className="text-sm text-slate/90 italic">{insight}</p>
                  </div>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
