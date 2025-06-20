"use client"

import { AlertTriangle, X, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Conflict {
  id: number
  type: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  time: string
}

interface ConflictPanelProps {
  conflicts: Conflict[]
  onResolve: (id: number) => void
}

export function ConflictPanel({ conflicts, onResolve }: ConflictPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-blue-500 bg-blue-50"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
        <h3 className="font-semibold text-base sm:text-lg">
          <span className="hidden sm:inline">Schedule Conflicts ({conflicts.length})</span>
          <span className="sm:hidden">Conflicts ({conflicts.length})</span>
        </h3>
      </div>

      {conflicts.map((conflict) => (
        <Alert key={conflict.id} className={`${getSeverityColor(conflict.severity)} border-l-4`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <Badge className={`${getSeverityBadgeColor(conflict.severity)} text-xs w-fit`}>
                  {conflict.severity.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Clock className="w-3 h-3" />
                  {conflict.time}
                </div>
              </div>
              <AlertDescription className="text-gray-800 text-sm pr-2">{conflict.message}</AlertDescription>
              <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row gap-1 sm:gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8">
                  Auto-Resolve
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  View Details
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResolve(conflict.id)}
              className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  )
}
