"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { NewReflectionModal } from "@/components/new-reflection-modal"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, Activity } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleProfileClick = () => {
    router.push("/dashboard")
  }

  const handleSignOut = () => {
    signOut()
    router.push("/sign-in")
  }

  return (
    <header className="border-b border-mist/50 py-6">
      <div className="container max-w-5xl px-4 flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="text-2xl font-serif text-slate">
          feminnate
        </Link>

        {user && (
          <nav className="hidden md:flex items-center space-x-6 mr-auto ml-12">
            <Link href="/dashboard" className="text-sm text-slate/70 hover:text-slate">
              dashboard
            </Link>
            <Link href="/body-awareness" className="text-sm text-slate/70 hover:text-slate">
              body awareness
            </Link>
            <Link href="/reflections" className="text-sm text-slate/70 hover:text-slate">
              reflections
            </Link>
            <Link href="/ai-companion" className="text-sm text-slate/70 hover:text-slate">
              ai companion
            </Link>
          </nav>
        )}

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full hover:bg-mist/20 flex items-center gap-2 p-1 pr-3"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-mist text-slate text-xs">
                        {user.username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-none bg-bone shadow-md">
                  <DropdownMenuLabel className="text-slate/70">account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-mist/30" />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer rounded-lg focus:bg-mist/20">
                    dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/body-awareness")}
                    className="cursor-pointer rounded-lg focus:bg-mist/20"
                  >
                    <Activity className="h-3.5 w-3.5 mr-2" />
                    <span>body awareness</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer rounded-lg focus:bg-mist/20"
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    <span>settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/ai-companion")}
                    className="cursor-pointer rounded-lg focus:bg-mist/20"
                  >
                    <span>ai companion</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-mist/30" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg focus:bg-mist/20 text-slate/70"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    <span>sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <NewReflectionModal />
            </>
          ) : (
            <Button asChild variant="ghost" className="rounded-full bg-mist/30 hover:bg-mist/50 text-slate">
              <Link href="/sign-in">sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
