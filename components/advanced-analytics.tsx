"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, MapPin, Clock, BookOpen, AlertTriangle, CheckCircle, Target } from "lucide-react"

interface AnalyticsData {
  roomUtilization: { name: string; usage: number; capacity: number; efficiency: number }[]
  teacherWorkload: { name: string; hours: number; classes: number; subjects: string[] }[]
  timeSlotAnalysis: { time: string; utilization: number; conflicts: number }[]
  subjectDistribution: { subject: string; classes: number; rooms: string[] }[]
  conflictTrends: { date: string; conflicts: number; resolved: number }[]
}

const ANALYTICS_DATA: AnalyticsData = {
  roomUtilization: [
    { name: "Room 101", usage: 85, capacity: 30, efficiency: 92 },
    { name: "Lab A", usage: 78, capacity: 24, efficiency: 88 },
    { name: "Gymnasium", usage: 45, capacity: 100, efficiency: 65 },
    { name: "Room 102", usage: 92, capacity: 28, efficiency: 95 },
    { name: "Library", usage: 35, capacity: 50, efficiency: 58 },
    { name: "Art Room", usage: 68, capacity: 20, efficiency: 82 },
  ],
  teacherWorkload: [
    { name: "Ms. Johnson", hours: 25, classes: 18, subjects: ["Mathematics", "Algebra"] },
    { name: "Mr. Smith", hours: 20, classes: 15, subjects: ["English", "Literature"] },
    { name: "Dr. Brown", hours: 30, classes: 22, subjects: ["Chemistry", "Physics", "Biology"] },
    { name: "Ms. Davis", hours: 22, classes: 16, subjects: ["Physical Education", "Health"] },
    { name: "Mr. Wilson", hours: 18, classes: 12, subjects: ["History", "Social Studies"] },
  ],
  timeSlotAnalysis: [
    { time: "08:00", utilization: 65, conflicts: 0 },
    { time: "09:00", utilization: 85, conflicts: 1 },
    { time: "10:00", utilization: 92, conflicts: 2 },
    { time: "11:00", utilization: 88, conflicts: 1 },
    { time: "12:00", utilization: 45, conflicts: 0 },
    { time: "13:00", utilization: 78, conflicts: 1 },
    { time: "14:00", utilization: 82, conflicts: 0 },
    { time: "15:00", utilization: 68, conflicts: 0 },
    { time: "16:00", utilization: 35, conflicts: 0 },
  ],
  subjectDistribution: [
    { subject: "Mathematics", classes: 18, rooms: ["Room 101", "Room 102"] },
    { subject: "English", classes: 15, rooms: ["Room 102", "Library"] },
    { subject: "Science", classes: 22, rooms: ["Lab A", "Lab B"] },
    { subject: "Physical Education", classes: 12, rooms: ["Gymnasium"] },
    { subject: "History", classes: 10, rooms: ["Room 101", "Room 102"] },
    { subject: "Art", classes: 8, rooms: ["Art Room"] },
  ],
  conflictTrends: [
    { date: "Mon", conflicts: 5, resolved: 4 },
    { date: "Tue", conflicts: 3, resolved: 3 },
    { date: "Wed", conflicts: 7, resolved: 5 },
    { date: "Thu", conflicts: 2, resolved: 2 },
    { date: "Fri", conflicts: 4, resolved: 4 },
  ],
}

export function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const getUtilizationColor = (value: number) => {
    if (value >= 85) return "text-green-600"
    if (value >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getWorkloadColor = (hours: number) => {
    if (hours > 28) return "text-red-600"
    if (hours > 24) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Advanced Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Comprehensive insights into schedule performance, resource utilization, and optimization opportunities.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="utilization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="utilization">Room Utilization</TabsTrigger>
          <TabsTrigger value="workload">Teacher Workload</TabsTrigger>
          <TabsTrigger value="timeslots">Time Analysis</TabsTrigger>
          <TabsTrigger value="trends">Conflict Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-6">
          {/* Room Utilization Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Average Utilization</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        ANALYTICS_DATA.roomUtilization.reduce((sum, room) => sum + room.usage, 0) /
                          ANALYTICS_DATA.roomUtilization.length,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Optimal Rooms</p>
                    <p className="text-2xl font-bold text-green-600">
                      {ANALYTICS_DATA.roomUtilization.filter((room) => room.efficiency >= 85).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Underutilized</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {ANALYTICS_DATA.roomUtilization.filter((room) => room.usage < 60).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Room Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Room Utilization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ANALYTICS_DATA.roomUtilization.map((room) => (
                  <div key={room.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{room.name}</span>
                        <Badge variant="outline">Capacity: {room.capacity}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getUtilizationColor(room.usage)}`}>{room.usage}%</span>
                        <span className="text-sm text-gray-500">Efficiency: {room.efficiency}%</span>
                      </div>
                    </div>
                    <Progress value={room.usage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          {/* Teacher Workload Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Average Hours/Week</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(
                        ANALYTICS_DATA.teacherWorkload.reduce((sum, teacher) => sum + teacher.hours, 0) /
                          ANALYTICS_DATA.teacherWorkload.length,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Balanced Teachers</p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        ANALYTICS_DATA.teacherWorkload.filter((teacher) => teacher.hours >= 20 && teacher.hours <= 25)
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Overloaded</p>
                    <p className="text-2xl font-bold text-red-600">
                      {ANALYTICS_DATA.teacherWorkload.filter((teacher) => teacher.hours > 28).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Workload Details */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher Workload Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ANALYTICS_DATA.teacherWorkload.map((teacher) => (
                  <div key={teacher.name} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.subjects.join(", ")}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getWorkloadColor(teacher.hours)}`}>
                          {teacher.hours} hrs/week
                        </p>
                        <p className="text-sm text-gray-500">{teacher.classes} classes</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Weekly Load</span>
                        <span>{teacher.hours}/40 hours</span>
                      </div>
                      <Progress value={(teacher.hours / 40) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeslots" className="space-y-6">
          {/* Time Slot Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Time Slot Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ANALYTICS_DATA.timeSlotAnalysis.map((slot) => (
                  <div key={slot.time} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{slot.time}</span>
                        {slot.conflicts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {slot.conflicts} conflicts
                          </Badge>
                        )}
                      </div>
                      <span className={`font-semibold ${getUtilizationColor(slot.utilization)}`}>
                        {slot.utilization}%
                      </span>
                    </div>
                    <Progress value={slot.utilization} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ANALYTICS_DATA.subjectDistribution.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-medium">{subject.subject}</span>
                        <p className="text-sm text-gray-600">Rooms: {subject.rooms.join(", ")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{subject.classes}</p>
                      <p className="text-sm text-gray-500">classes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Conflict Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Conflict Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ANALYTICS_DATA.conflictTrends.map((day) => (
                  <div key={day.date} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{day.date}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-red-600">{day.conflicts} conflicts</span>
                        <span className="text-sm text-green-600">{day.resolved} resolved</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-red-100 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(day.conflicts / 10) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-green-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(day.resolved / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Improvements This Week
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Reduced conflicts by 40%
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Improved room utilization by 15%
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Balanced teacher workloads
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Library underutilized (35%)
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Peak hour congestion at 10:00 AM
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Dr. Brown overloaded (30 hrs/week)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
