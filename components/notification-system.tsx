"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react"

interface Notification {
  id: number
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionRequired?: boolean
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "warning",
    title: "Schedule Conflict Detected",
    message: "Ms. Johnson is scheduled in two rooms at 10:00 AM on Monday",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    actionRequired: true,
  },
  {
    id: 2,
    type: "info",
    title: "Room Booking Confirmed",
    message: "Lab A has been booked for Chemistry class on Tuesday",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isRead: false,
  },
  {
    id: 3,
    type: "error",
    title: "Teacher Absence Reported",
    message: "Mr. Smith will be absent tomorrow. 3 classes need reassignment.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: true,
    actionRequired: true,
  },
  {
    id: 4,
    type: "success",
    title: "Schedule Updated",
    message: "Weekly schedule has been successfully updated and published",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isRead: true,
  },
]

const JSX = "JSX" // Declare the JSX variable

export function NotificationSystem(): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }, [])

  const handleDismiss = useCallback((notificationId: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }, [])

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return timestamp.toLocaleDateString()
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo purposes)
      if (Math.random() < 0.1) {
        // 10% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now(),
          type: ["info", "warning", "success"][Math.floor(Math.random() * 3)] as any,
          title: "New Schedule Update",
          message: "A schedule change has been detected and processed",
          timestamp: new Date(),
          isRead: false,
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 max-h-[80vh]">
          <Card className="shadow-lg border">
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
                <div className="flex items-center gap-1 sm:gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs sm:text-sm">
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-0 max-h-80 sm:max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 sm:p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDismiss(notification.id)}
                              className="p-1 h-auto flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 pr-2">{notification.message}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs self-start sm:self-center"
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-center text-gray-500">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
