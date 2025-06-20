"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, MapPin, AlertTriangle, TrendingUp, Clock } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Classes",
      value: "156",
      change: "+12%",
      changeType: "positive",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Active Teachers",
      value: "24",
      change: "2 absent",
      changeType: "neutral",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Rooms Utilized",
      value: "18/22",
      change: "82%",
      changeType: "positive",
      icon: MapPin,
      color: "text-purple-600",
    },
    {
      title: "Conflicts",
      value: "3",
      change: "-2 from yesterday",
      changeType: "positive",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Efficiency",
      value: "94%",
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Avg Class Duration",
      value: "75min",
      change: "Standard",
      changeType: "neutral",
      icon: Clock,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{stat.title}</CardTitle>
            <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
