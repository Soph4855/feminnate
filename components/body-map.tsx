"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Define the body parts and their related areas with more anatomical precision
const bodyConnections = {
  head: ["neck", "face", "brain", "throat"],
  face: ["head", "throat", "neck"],
  brain: ["head", "nerves", "spine"],
  throat: ["neck", "chest", "face", "shoulders"],
  neck: ["head", "shoulders", "spine", "throat"],
  shoulders: ["neck", "arms", "upperBack", "chest"],
  chest: ["shoulders", "abdomen", "heart", "lungs", "ribs"],
  heart: ["chest", "lungs", "diaphragm"],
  lungs: ["chest", "diaphragm", "ribs"],
  diaphragm: ["chest", "abdomen", "lungs", "heart"],
  ribs: ["chest", "lungs", "upperBack"],
  arms: ["shoulders", "hands", "upperBack", "elbows"],
  elbows: ["arms", "wrists"],
  wrists: ["hands", "arms", "elbows"],
  hands: ["wrists", "arms"],
  spine: ["neck", "upperBack", "lowerBack", "brain", "nerves"],
  nerves: ["brain", "spine", "all"],
  upperBack: ["shoulders", "neck", "lowerBack", "spine", "ribs"],
  lowerBack: ["upperBack", "hips", "legs", "spine", "abdomen"],
  abdomen: ["chest", "hips", "lowerBack", "diaphragm", "pelvis", "digestive"],
  digestive: ["abdomen", "pelvis"],
  pelvis: ["abdomen", "hips", "legs", "lowerBack"],
  hips: ["lowerBack", "legs", "abdomen", "pelvis"],
  legs: ["hips", "knees", "feet", "lowerBack"],
  knees: ["legs", "ankles"],
  ankles: ["feet", "legs", "knees"],
  feet: ["legs", "ankles"],
  all: ["nerves", "brain", "spine"], // For whole-body sensations
}

type BodyPart = keyof typeof bodyConnections

interface Marker {
  id: string
  part: BodyPart
  x: number
  y: number
  note?: string
  intensity?: number
}

interface BodyMapProps {
  onMarkerAdded?: (marker: Marker) => void
  onMarkerRemoved?: (markerId: string) => void
  onMarkerSelected?: (marker: Marker) => void
  initialMarkers?: Marker[]
  readOnly?: boolean
}

export function BodyMap({
  onMarkerAdded,
  onMarkerRemoved,
  onMarkerSelected,
  initialMarkers = [],
  readOnly = false,
}: BodyMapProps) {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers)
  const [activeConnections, setActiveConnections] = useState<BodyPart[]>([])
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [activePart, setActivePart] = useState<BodyPart | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [showAllConnections, setShowAllConnections] = useState(false)
  const bodyMapRef = useRef<HTMLDivElement>(null)

  // Clear the long press timer when component unmounts
  useEffect(() => {
    return () => {
      if (longPressTimer) clearTimeout(longPressTimer)
    }
  }, [longPressTimer])

  // Connect markers that are on related body parts
  useEffect(() => {
    if (showAllConnections && markers.length > 1) {
      // Find all connections between markers
      const connectedParts = new Set<BodyPart>()

      markers.forEach((marker) => {
        connectedParts.add(marker.part)

        // For each marker, find other markers on connected body parts
        markers.forEach((otherMarker) => {
          if (marker.id !== otherMarker.id) {
            if (bodyConnections[marker.part].includes(otherMarker.part)) {
              connectedParts.add(otherMarker.part)
            }
          }
        })
      })

      setActiveConnections(Array.from(connectedParts))
    }
  }, [showAllConnections, markers])

  const handleBodyPartClick = (part: BodyPart, e: React.MouseEvent) => {
    if (readOnly) return

    // Get click position relative to the body map
    const rect = bodyMapRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Create a new marker
    const newMarker: Marker = {
      id: `marker-${Date.now()}`,
      part,
      x,
      y,
      intensity: 1,
    }

    setMarkers((prev) => [...prev, newMarker])
    setSelectedMarker(newMarker.id)
    if (onMarkerAdded) onMarkerAdded(newMarker)
    if (onMarkerSelected) onMarkerSelected(newMarker)
  }

  const handleMarkerClick = (marker: Marker, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedMarker(marker.id)
    if (onMarkerSelected) onMarkerSelected(marker)

    // Show connections from this marker to related body parts
    setActivePart(marker.part)
    setActiveConnections([marker.part, ...bodyConnections[marker.part]])

    // Hide connections after a delay
    setTimeout(() => {
      if (!showAllConnections) {
        setActiveConnections([])
        setActivePart(null)
      }
    }, 3000)
  }

  const handleBodyPartMouseDown = (part: BodyPart) => {
    if (readOnly) return

    setActivePart(part)

    // Start a timer for long press
    const timer = setTimeout(() => {
      // Show connections after long press
      setActiveConnections([part, ...bodyConnections[part]])
    }, 300) // 300ms for long press

    setLongPressTimer(timer)
  }

  const handleBodyPartMouseUp = () => {
    if (readOnly) return

    // Clear the timer if mouse up happens before long press is detected
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Hide connections after a delay
    setTimeout(() => {
      if (!showAllConnections) {
        setActiveConnections([])
        setActivePart(null)
      }
    }, 3000) // Keep connections visible for 3s after release
  }

  const handleMarkerRemove = (markerId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (readOnly) return

    setMarkers((prev) => prev.filter((marker) => marker.id !== markerId))
    if (selectedMarker === markerId) {
      setSelectedMarker(null)
    }
    if (onMarkerRemoved) onMarkerRemoved(markerId)
  }

  const toggleAllConnections = () => {
    setShowAllConnections(!showAllConnections)
    if (!showAllConnections) {
      // When turning on, show all connections between markers
      const allParts = markers.map((m) => m.part)
      const allConnections = new Set<BodyPart>()

      allParts.forEach((part) => {
        allConnections.add(part)
        bodyConnections[part].forEach((conn) => allConnections.add(conn as BodyPart))
      })

      setActiveConnections(Array.from(allConnections))
    } else {
      // When turning off, hide all connections
      setActiveConnections([])
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto" ref={bodyMapRef}>
      <div className="absolute top-2 right-2 z-10">
        <button
          className={`px-3 py-1 rounded-full text-xs ${showAllConnections ? "bg-blush/50" : "bg-mist/30"}`}
          onClick={toggleAllConnections}
        >
          {showAllConnections ? "hide connections" : "show connections"}
        </button>
      </div>

      {/* Vitruvian Man inspired SVG */}
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full"
        style={{
          filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.05))",
        }}
      >
        {/* Parchment-like background */}
        <defs>
          <pattern id="parchment-pattern" patternUnits="userSpaceOnUse" width="1000" height="1000">
            <image
              href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiPjxmaWx0ZXIgaWQ9Im5vaXNlIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIgcmVzdWx0PSJub2lzZSIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVlZmRmIi8+PC9zdmc+"
              width="1000"
              height="1000"
              style={{ mixBlendMode: "multiply" }}
            />
          </pattern>
          <filter id="paper-texture" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="sepia-tone">
            <feColorMatrix
              type="matrix"
              values="0.393 0.769 0.189 0 0
                      0.349 0.686 0.168 0 0
                      0.272 0.534 0.131 0 0
                      0     0     0     1 0"
            />
          </filter>
        </defs>

        {/* Background rectangle with parchment texture */}
        <rect x="0" y="0" width="1000" height="1000" fill="url(#parchment-pattern)" />

        {/* Circle and square from Vitruvian Man */}
        <circle
          cx="500"
          cy="500"
          r="330"
          fill="none"
          stroke="#c1a978"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="5,5"
        />
        <rect
          x="170"
          y="170"
          width="660"
          height="660"
          fill="none"
          stroke="#c1a978"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="5,5"
        />

        {/* Connection lines */}
        <g className="connections">
          {activeConnections.length > 1 &&
            activeConnections.map((part, i) => {
              if (!activePart && !showAllConnections) return null

              // For each active part, draw connections to related parts
              const sourceCoords = getBodyPartCoordinates(activePart || part)

              // Get all related parts that are also in activeConnections
              const relatedParts = bodyConnections[part].filter((relatedPart) =>
                activeConnections.includes(relatedPart as BodyPart),
              )

              return relatedParts.map((relatedPart) => {
                const targetCoords = getBodyPartCoordinates(relatedPart as BodyPart)

                if (!sourceCoords || !targetCoords || part === relatedPart) return null

                // Create a unique key for this connection
                const connectionKey = [part, relatedPart].sort().join("-")

                return (
                  <motion.path
                    key={`connection-${connectionKey}`}
                    d={`M${sourceCoords.x},${sourceCoords.y} 
                     C${(sourceCoords.x + targetCoords.x) / 2 + 20},${(sourceCoords.y + targetCoords.y) / 2} 
                      ${(sourceCoords.x + targetCoords.x) / 2 - 20},${(sourceCoords.y + targetCoords.y) / 2} 
                      ${targetCoords.x},${targetCoords.y}`}
                    stroke="#c1a978"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )
              })
            })}
        </g>

        {/* Vitruvian Man inspired body outline */}
        <g className="body-outline" fill="none" stroke="#c1a978" strokeWidth="1.5" filter="url(#sepia-tone)">
          {/* Head */}
          <path
            d="M500,220 C530,220 550,240 550,270 C550,300 530,320 500,320 C470,320 450,300 450,270 C450,240 470,220 500,220 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("head"),
            })}
            onClick={(e) => handleBodyPartClick("head", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("head")}
            onMouseUp={handleBodyPartMouseUp}
            onMouseLeave={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("head")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Face details */}
          <path
            d="M480,260 C485,255 495,255 500,260 C505,255 515,255 520,260 M490,290 C495,295 505,295 510,290"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("face"),
            })}
            onClick={(e) => handleBodyPartClick("face", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("face")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("face")}
            onTouchEnd={handleBodyPartMouseUp}
            strokeWidth="1"
          />

          {/* Neck */}
          <path
            d="M480,320 C480,335 490,350 500,350 C510,350 520,335 520,320"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("neck"),
            })}
            onClick={(e) => handleBodyPartClick("neck", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("neck")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("neck")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Shoulders and arms - Vitruvian Man style with arms outstretched */}
          <path
            d="M430,370 C450,360 550,360 570,370"
            className={cn("cursor-pointer transition-colors duration-300", {
              "stroke-blush stroke-2": activeConnections.includes("shoulders"),
            })}
            onClick={(e) => handleBodyPartClick("shoulders", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("shoulders")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("shoulders")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Left arm outstretched */}
          <path
            d="M430,370 L250,370 L170,370"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("arms"),
            })}
            onClick={(e) => handleBodyPartClick("arms", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("arms")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("arms")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Right arm outstretched */}
          <path
            d="M570,370 L750,370 L830,370"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("arms"),
            })}
            onClick={(e) => handleBodyPartClick("arms", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("arms")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("arms")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Left hand */}
          <path
            d="M170,370 C160,365 155,360 160,350 C165,345 175,345 180,350 C185,345 190,345 195,350 C200,345 205,345 210,350 C215,345 220,345 225,350 C230,355 230,365 225,370 C220,375 210,380 200,375 C190,380 180,380 170,370 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("hands"),
            })}
            onClick={(e) => handleBodyPartClick("hands", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("hands")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("hands")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Right hand */}
          <path
            d="M830,370 C840,365 845,360 840,350 C835,345 825,345 820,350 C815,345 810,345 805,350 C800,345 795,345 790,350 C785,345 780,345 775,350 C770,355 770,365 775,370 C780,375 790,380 800,375 C810,380 820,380 830,370 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("hands"),
            })}
            onClick={(e) => handleBodyPartClick("hands", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("hands")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("hands")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Torso outline */}
          <path
            d="M430,370 L430,500 C430,530 460,550 500,550 C540,550 570,530 570,500 L570,370"
            className="cursor-pointer"
            stroke="#c1a978"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Chest with anatomical detail */}
          <path
            d="M450,390 C460,380 540,380 550,390 C560,410 560,430 550,450 C540,460 460,460 450,450 C440,430 440,410 450,390 Z
               M470,400 C465,410 465,430 470,440 M530,400 C535,410 535,430 530,440"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("chest"),
            })}
            onClick={(e) => handleBodyPartClick("chest", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("chest")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("chest")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Heart */}
          <path
            d="M485,410 C490,400 510,400 515,410 C520,420 515,430 500,440 C485,430 480,420 485,410 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/30": activeConnections.includes("heart"),
            })}
            onClick={(e) => handleBodyPartClick("heart", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("heart")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("heart")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Abdomen with anatomical detail */}
          <path
            d="M450,450 C460,460 540,460 550,450 C560,480 560,510 550,530 C540,540 460,540 450,530 C440,510 440,480 450,450 Z
               M480,470 L520,470 M480,490 L520,490 M480,510 L520,510"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("abdomen"),
            })}
            onClick={(e) => handleBodyPartClick("abdomen", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("abdomen")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("abdomen")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Pelvis */}
          <path
            d="M450,530 C460,540 540,540 550,530 C560,550 560,560 550,570 C530,580 470,580 450,570 C440,560 440,550 450,530 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("pelvis"),
            })}
            onClick={(e) => handleBodyPartClick("pelvis", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("pelvis")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("pelvis")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Legs in Vitruvian Man stance */}
          {/* Left leg normal stance */}
          <path
            d="M470,570 L450,700 L440,800"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("legs"),
            })}
            onClick={(e) => handleBodyPartClick("legs", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("legs")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("legs")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Right leg normal stance */}
          <path
            d="M530,570 L550,700 L560,800"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("legs"),
            })}
            onClick={(e) => handleBodyPartClick("legs", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("legs")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("legs")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Left leg spread stance (Vitruvian style) */}
          <path
            d="M470,570 L350,700 L300,800"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("legs"),
            })}
            onClick={(e) => handleBodyPartClick("legs", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("legs")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("legs")}
            onTouchEnd={handleBodyPartMouseUp}
            strokeDasharray="5,5"
            opacity="0.7"
          />

          {/* Right leg spread stance (Vitruvian style) */}
          <path
            d="M530,570 L650,700 L700,800"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("legs"),
            })}
            onClick={(e) => handleBodyPartClick("legs", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("legs")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("legs")}
            onTouchEnd={handleBodyPartMouseUp}
            strokeDasharray="5,5"
            opacity="0.7"
          />

          {/* Left foot normal stance */}
          <path
            d="M440,800 C430,805 425,810 430,815 C435,820 450,820 455,815 C460,810 455,805 450,800 L440,800 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("feet"),
            })}
            onClick={(e) => handleBodyPartClick("feet", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("feet")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("feet")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Right foot normal stance */}
          <path
            d="M560,800 C570,805 575,810 570,815 C565,820 550,820 545,815 C540,810 545,805 550,800 L560,800 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("feet"),
            })}
            onClick={(e) => handleBodyPartClick("feet", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("feet")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("feet")}
            onTouchEnd={handleBodyPartMouseUp}
          />

          {/* Left foot spread stance */}
          <path
            d="M300,800 C290,805 285,810 290,815 C295,820 310,820 315,815 C320,810 315,805 310,800 L300,800 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("feet"),
            })}
            onClick={(e) => handleBodyPartClick("feet", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("feet")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("feet")}
            onTouchEnd={handleBodyPartMouseUp}
            strokeDasharray="5,5"
            opacity="0.7"
          />

          {/* Right foot spread stance */}
          <path
            d="M700,800 C710,805 715,810 710,815 C705,820 690,820 685,815 C680,810 685,805 690,800 L700,800 Z"
            className={cn("cursor-pointer transition-colors duration-300", {
              "fill-blush/20": activeConnections.includes("feet"),
            })}
            onClick={(e) => handleBodyPartClick("feet", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("feet")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("feet")}
            onTouchEnd={handleBodyPartMouseUp}
            strokeDasharray="5,5"
            opacity="0.7"
          />

          {/* Spine */}
          <path
            d="M500,320 L500,570"
            className={cn("cursor-pointer", {
              "stroke-blush stroke-2": activeConnections.includes("spine"),
            })}
            onClick={(e) => handleBodyPartClick("spine", e as React.MouseEvent)}
            onMouseDown={() => handleBodyPartMouseDown("spine")}
            onMouseUp={handleBodyPartMouseUp}
            onTouchStart={() => handleBodyPartMouseDown("spine")}
            onTouchEnd={handleBodyPartMouseUp}
            strokeDasharray="3,3"
            strokeWidth="1.5"
          />

          {/* Da Vinci-style annotations */}
          <text x="520" y="240" className="text-xs italic fill-amber-900/70" style={{ fontFamily: "serif" }}>
            caput
          </text>
          <text x="520" y="420" className="text-xs italic fill-amber-900/70" style={{ fontFamily: "serif" }}>
            cor
          </text>
          <text x="520" y="500" className="text-xs italic fill-amber-900/70" style={{ fontFamily: "serif" }}>
            venter
          </text>
          <text x="300" y="350" className="text-xs italic fill-amber-900/70" style={{ fontFamily: "serif" }}>
            brachium
          </text>
          <text x="400" y="700" className="text-xs italic fill-amber-900/70" style={{ fontFamily: "serif" }}>
            crus
          </text>

          {/* Subtle grid lines for da Vinci effect */}
          <path
            d="M200,0 L200,1000 M400,0 L400,1000 M600,0 L600,1000 M800,0 L800,1000 
               M0,200 L1000,200 M0,400 L1000,400 M0,600 L1000,600 M0,800 L1000,800"
            stroke="#c1a978"
            strokeWidth="0.5"
            opacity="0.2"
          />

          {/* Vitruvian Man proportional lines */}
          <path
            d="M500,220 L500,830 M170,370 L830,370 M300,800 L700,800"
            stroke="#c1a978"
            strokeWidth="0.5"
            opacity="0.2"
            strokeDasharray="5,5"
          />
        </g>
      </svg>

      {/* Markers */}
      <AnimatePresence>
        {markers.map((marker) => (
          <motion.div
            key={marker.id}
            className="absolute"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => handleMarkerClick(marker, e as React.MouseEvent)}
          >
            <div className={`relative ${selectedMarker === marker.id ? "z-10" : "z-0"}`}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={`${selectedMarker === marker.id ? "scale-125" : "scale-100"} transition-transform duration-300`}
              >
                <path
                  d="M12 0L15.708 8.20615L24 9.52714L18 15.9139L19.416 24L12 20.2062L4.584 24L6 15.9139L0 9.52714L8.292 8.20615L12 0Z"
                  fill="#F4EAE6"
                  stroke="#c1a978"
                  strokeWidth="0.5"
                />
              </svg>
              {!readOnly && (
                <button
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blush/80 text-white flex items-center justify-center text-xs"
                  onClick={(e) => handleMarkerRemove(marker.id, e as React.MouseEvent)}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper function to get coordinates for body parts
function getBodyPartCoordinates(part: BodyPart): { x: number; y: number } | null {
  switch (part) {
    case "head":
      return { x: 500, y: 270 }
    case "face":
      return { x: 500, y: 260 }
    case "brain":
      return { x: 500, y: 240 }
    case "throat":
      return { x: 500, y: 330 }
    case "neck":
      return { x: 500, y: 335 }
    case "shoulders":
      return { x: 500, y: 370 }
    case "chest":
      return { x: 500, y: 420 }
    case "heart":
      return { x: 500, y: 420 }
    case "lungs":
      return { x: 500, y: 410 }
    case "diaphragm":
      return { x: 500, y: 450 }
    case "ribs":
      return { x: 500, y: 420 }
    case "arms":
      return { x: 350, y: 370 }
    case "elbows":
      return { x: 250, y: 370 }
    case "wrists":
      return { x: 200, y: 370 }
    case "hands":
      return { x: 170, y: 370 }
    case "spine":
      return { x: 500, y: 450 }
    case "nerves":
      return { x: 500, y: 400 }
    case "upperBack":
      return { x: 500, y: 400 }
    case "lowerBack":
      return { x: 500, y: 500 }
    case "abdomen":
      return { x: 500, y: 490 }
    case "digestive":
      return { x: 500, y: 490 }
    case "pelvis":
      return { x: 500, y: 550 }
    case "hips":
      return { x: 500, y: 570 }
    case "legs":
      return { x: 500, y: 650 }
    case "knees":
      return { x: 500, y: 700 }
    case "ankles":
      return { x: 500, y: 780 }
    case "feet":
      return { x: 500, y: 810 }
    case "all":
      return { x: 500, y: 500 }
    default:
      return null
  }
}
