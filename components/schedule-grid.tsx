"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, GripVertical } from "lucide-react"
import type { ScheduleItem, ScheduleGridProps } from "./types" // Declare the variable before using it

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] as const
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const

export function ScheduleGrid({ scheduleData, filters, onScheduleUpdate }: ScheduleGridProps): JSX.Element {
  const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<{ day: string; time: string } | null>(null)

  // Memoized filtered schedule
  const filteredSchedule = useMemo(() => {
    return scheduleData.filter((item) => {
      if (filters.selectedGrade !== "all" && item.grade !== filters.selectedGrade) return false
      if (filters.selectedTeacher !== "all" && item.teacher !== filters.selectedTeacher) return false
      if (filters.selectedRoom !== "all" && item.room !== filters.selectedRoom) return false
      return true
    })
  }, [scheduleData, filters])

  // Event handlers
  const handleDragStart = useCallback((e: React.DragEvent, item: ScheduleItem): void => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, day: string, time: string): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverSlot({ day, time })
  }, [])

  const handleDragLeave = useCallback((): void => {
    setDragOverSlot(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, day: string, time: string): void => {
      e.preventDefault()
      if (!draggedItem) return

      const updatedSchedule = scheduleData.map((item) => (item.id === draggedItem.id ? { ...item, day, time } : item))

      onScheduleUpdate(updatedSchedule)
      setDraggedItem(null)
      setDragOverSlot(null)
    },
    [draggedItem, scheduleData, onScheduleUpdate],
  )

  const getItemsForSlot = useCallback(
    (day: string, time: string): ScheduleItem[] => {
      return filteredSchedule.filter((item) => item.day === day && item.time === time)
    },
    [filteredSchedule],
  )

  const isSlotHighlighted = useCallback(
    (day: string, time: string): boolean => {
      return dragOverSlot?.day === day && dragOverSlot?.time === time
    },
    [dragOverSlot],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Weekly Schedule Grid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[320px] sm:min-w-[600px] lg:min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2 sm:mb-4">
              <div className="font-semibold text-center py-1 sm:py-2 text-xs sm:text-sm">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="font-semibold text-center py-1 sm:py-2 bg-gray-50 rounded text-xs sm:text-sm">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {TIME_SLOTS.map((time) => (
              <div key={time} className="grid grid-cols-6 gap-1 sm:gap-2 mb-1 sm:mb-2">
                <div className="flex items-center justify-center py-2 sm:py-4 font-medium text-gray-600 bg-gray-50 rounded text-xs sm:text-sm">
                  {time}
                </div>
                {DAYS.map((day) => (
                  <div
                    key={`${day}-${time}`}
                    className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border-2 border-dashed border-gray-200 rounded-lg transition-colors ${
                      isSlotHighlighted(day, time)
                        ? "border-blue-400 bg-blue-50"
                        : "hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onDragOver={(e) => handleDragOver(e, day, time)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day, time)}
                  >
                    {getItemsForSlot(day, time).map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className={`${item.color} text-white p-1 sm:p-2 rounded-lg mb-1 cursor-move hover:opacity-90 transition-opacity`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <GripVertical className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span className="font-medium text-xs">{item.subject}</span>
                        </div>
                        <div className="text-xs opacity-90 space-y-0.5 sm:space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="truncate">{item.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="truncate">{item.room}</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration}min</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1 hidden sm:inline-flex">
                          {item.grade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">💡 How to use:</h4>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
            <li>• Drag and drop classes to reschedule them</li>
            <li className="hidden sm:block">• Use filters above to focus on specific grades, teachers, or rooms</li>
            <li>• Conflicts are automatically detected and highlighted</li>
            <li className="hidden sm:block">• Changes are saved in real-time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
