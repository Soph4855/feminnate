"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, MessageCircle, Sparkles, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "home",
      href: "/",
      icon: Home,
    },
    {
      name: "tracker",
      href: "/dashboard",
      icon: Calendar,
    },
    {
      name: "body",
      href: "/body-awareness",
      icon: Activity,
    },
    {
      name: "reflections",
      href: "/reflections",
      icon: MessageCircle,
    },
    {
      name: "ai",
      href: "/ai-companion",
      icon: Sparkles,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bone border-t border-mist/30 py-2 px-4 md:hidden">
      <nav className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg",
                isActive ? "text-slate" : "text-slate/50",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
