"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function AuthTest() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Name:</strong> {user.profile.full_name}
            </p>
            <p>
              <strong>Role:</strong> {user.profile.role}
            </p>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <Button onClick={signOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        ) : (
          <p>Not authenticated</p>
        )}
      </CardContent>
    </Card>
  )
}
