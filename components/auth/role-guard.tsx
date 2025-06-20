"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface RoleGuardProps {
  allowedRoles: ("admin" | "teacher" | "student")[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  if (!user) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>You must be logged in to access this content.</AlertDescription>
      </Alert>
    )
  }

  if (!allowedRoles.includes(user.profile.role)) {
    return (
      fallback || (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this content. Required roles: {allowedRoles.join(", ")}
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
