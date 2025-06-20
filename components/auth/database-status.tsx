"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "ready" | "error">("checking")
  const [error, setError] = useState<string>("")
  const supabase = getSupabaseClient()

  const checkDatabase = async () => {
    setStatus("checking")
    setError("")

    try {
      // Try to query the profiles table
      const { error } = await supabase.from("profiles").select("id").limit(1)

      if (error) {
        if (error.code === "42P01") {
          setError("Profiles table doesn't exist. Please run the database setup scripts.")
        } else {
          setError(`Database error: ${error.message}`)
        }
        setStatus("error")
      } else {
        setStatus("ready")
      }
    } catch (error) {
      setError(`Connection error: ${error}`)
      setStatus("error")
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  if (status === "checking") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Checking database status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "ready") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Database is ready!</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>Database Setup Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">To fix this issue:</p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to the SQL Editor</li>
            <li>Run the setup-auth-tables.sql script</li>
            <li>Click the refresh button below</li>
          </ol>
        </div>

        <Button onClick={checkDatabase} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Again
        </Button>
      </CardContent>
    </Card>
  )
}
