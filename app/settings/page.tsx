"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/route-guard"

export default function SettingsPage() {
  const { user, updateUser, signOut } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState(user?.preferences?.notifications || false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    if (!user) return

    updateUser({
      preferences: {
        ...user.preferences,
        notifications,
      },
    })

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleDeleteAccount = () => {
    if (confirm("are you sure you want to delete your account? this cannot be undone.")) {
      signOut()
      router.push("/sign-in")
    }
  }

  return (
    <RouteGuard>
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="container max-w-2xl py-12 px-4 flex-1">
          <h1 className="text-3xl mb-8">settings</h1>

          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader>
                <h2 className="text-xl">account</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">username</p>
                    <p className="text-sm text-slate/70">{user?.username}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">joined</p>
                    <p className="text-sm text-slate/70">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader>
                <h2 className="text-xl">preferences</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">notifications</p>
                    <p className="text-sm text-slate/70">receive gentle reminders to reflect</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-mist"
                  />
                </div>

                <Button onClick={handleSave} className="rounded-full bg-mist hover:bg-mist/80 text-slate w-full mt-4">
                  {isSaved ? "saved" : "save preferences"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-blush/10">
              <CardHeader>
                <h2 className="text-xl">danger zone</h2>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="rounded-full border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 w-full"
                  onClick={handleDeleteAccount}
                >
                  delete account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </RouteGuard>
  )
}
