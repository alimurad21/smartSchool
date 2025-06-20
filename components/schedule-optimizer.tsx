"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

interface OptimizationResult {
  id: string
  type: "room_assignment" | "teacher_workload" | "time_efficiency" | "conflict_resolution"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  savings: string
  status: "pending" | "applied" | "rejected"
}

interface OptimizationMetrics {
  efficiency: number
  conflicts: number
  roomUtilization: number
  teacherWorkload: number
  timeSlotUsage: number
}

const INITIAL_RESULTS: OptimizationResult[] = [
  {
    id: "1",
    type: "conflict_resolution",
    title: "Resolve Lab A Double Booking",
    description: "Move Chemistry Lab from 11:00 to 14:00 to avoid conflict with Biology",
    impact: "high",
    savings: "2 conflicts resolved",
    status: "pending",
  },
  {
    id: "2",
    type: "teacher_workload",
    title: "Balance Ms. Johnson's Schedule",
    description: "Redistribute 2 classes to reduce consecutive teaching hours",
    impact: "medium",
    savings: "15% workload reduction",
    status: "pending",
  },
  {
    id: "3",
    type: "room_assignment",
    title: "Optimize Room 101 Usage",
    description: "Consolidate similar subjects to improve room utilization",
    impact: "medium",
    savings: "20% efficiency gain",
    status: "pending",
  },
  {
    id: "4",
    type: "time_efficiency",
    title: "Optimize Morning Schedule",
    description: "Move high-energy subjects to morning slots for better learning",
    impact: "low",
    savings: "5% performance boost",
    status: "pending",
  },
]

const INITIAL_METRICS: OptimizationMetrics = {
  efficiency: 78,
  conflicts: 3,
  roomUtilization: 65,
  teacherWorkload: 82,
  timeSlotUsage: 71,
}

export function ScheduleOptimizer() {
  const [results, setResults] = useState<OptimizationResult[]>(INITIAL_RESULTS)
  const [metrics, setMetrics] = useState<OptimizationMetrics>(INITIAL_METRICS)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)

  const handleOptimize = useCallback(async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    // Simulate optimization process
    const steps = [
      "Analyzing current schedule...",
      "Detecting conflicts...",
      "Calculating room utilization...",
      "Balancing teacher workloads...",
      "Optimizing time slots...",
      "Generating recommendations...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setOptimizationProgress(((i + 1) / steps.length) * 100)
    }

    // Update metrics after optimization
    setMetrics({
      efficiency: 92,
      conflicts: 0,
      roomUtilization: 85,
      teacherWorkload: 75,
      timeSlotUsage: 88,
    })

    setIsOptimizing(false)
  }, [])

  const handleApplyResult = useCallback((resultId: string) => {
    setResults((prev) => prev.map((result) => (result.id === resultId ? { ...result, status: "applied" } : result)))
  }, [])

  const handleRejectResult = useCallback((resultId: string) => {
    setResults((prev) => prev.map((result) => (result.id === resultId ? { ...result, status: "rejected" } : result)))
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getMetricColor = (value: number) => {
    if (value >= 85) return "text-green-600"
    if (value >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Schedule Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">
                Automatically optimize your schedule for maximum efficiency and minimal conflicts
              </p>
              {isOptimizing && (
                <div className="space-y-2">
                  <Progress value={optimizationProgress} className="w-full" />
                  <p className="text-sm text-gray-500">Optimizing schedule... {Math.round(optimizationProgress)}%</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleOptimize} disabled={isOptimizing} className="flex items-center gap-2">
                {isOptimizing ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Optimization
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="settings">Optimization Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Overall Efficiency</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.efficiency)}`}>{metrics.efficiency}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Conflicts</p>
                    <p className={`text-2xl font-bold ${metrics.conflicts === 0 ? "text-green-600" : "text-red-600"}`}>
                      {metrics.conflicts}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Room Utilization</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.roomUtilization)}`}>
                      {metrics.roomUtilization}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Teacher Workload</p>
                    <p className={`text-2xl font-bold ${getMetricColor(100 - metrics.teacherWorkload)}`}>
                      {metrics.teacherWorkload}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time Efficiency</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.timeSlotUsage)}`}>
                      {metrics.timeSlotUsage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Schedule Efficiency</span>
                    <span>{metrics.efficiency}%</span>
                  </div>
                  <Progress value={metrics.efficiency} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Room Utilization</span>
                    <span>{metrics.roomUtilization}%</span>
                  </div>
                  <Progress value={metrics.roomUtilization} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Teacher Balance</span>
                    <span>{100 - metrics.teacherWorkload}%</span>
                  </div>
                  <Progress value={100 - metrics.teacherWorkload} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time Slot Usage</span>
                    <span>{metrics.timeSlotUsage}%</span>
                  </div>
                  <Progress value={metrics.timeSlotUsage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {result.type === "conflict_resolution" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {result.type === "teacher_workload" && <Users className="w-4 h-4 text-blue-500" />}
                          {result.type === "room_assignment" && <MapPin className="w-4 h-4 text-purple-500" />}
                          {result.type === "time_efficiency" && <Clock className="w-4 h-4 text-green-500" />}
                          <h3 className="font-semibold">{result.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(result.impact)}>{result.impact.toUpperCase()} IMPACT</Badge>
                          <Badge className={getStatusColor(result.status)}>{result.status.toUpperCase()}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{result.description}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">{result.savings}</span>
                      </div>
                    </div>
                    {result.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApplyResult(result.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Apply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectResult(result.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Optimization Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Optimization settings allow you to customize how the AI prioritizes different aspects of scheduling.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Priority Weights</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Conflict Resolution</label>
                        <Progress value={90} className="h-2 mt-1" />
                        <span className="text-xs text-gray-500">High Priority (90%)</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Room Utilization</label>
                        <Progress value={70} className="h-2 mt-1" />
                        <span className="text-xs text-gray-500">Medium Priority (70%)</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Teacher Workload Balance</label>
                        <Progress value={80} className="h-2 mt-1" />
                        <span className="text-xs text-gray-500">High Priority (80%)</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time Efficiency</label>
                        <Progress value={60} className="h-2 mt-1" />
                        <span className="text-xs text-gray-500">Medium Priority (60%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Constraints</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Respect teacher preferences</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maintain subject-room matching</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Preserve existing bookings</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow cross-grade scheduling</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
