"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ScheduleItemFormProps {
  initialData?: any
  onSubmit: (item: any) => void
  onCancel: () => void
  onDelete?: () => void
}

export const ScheduleItemForm = ({ initialData, onSubmit, onCancel, onDelete }: ScheduleItemFormProps) => {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    teacher: initialData?.teacher || "",
    room: initialData?.room || "",
    grade: initialData?.grade || "",
    time: initialData?.time || "",
    duration: initialData?.duration || 60,
    day: initialData?.day || "",
    color: initialData?.color || "bg-blue-500",
    status: initialData?.status || "active",
    recurring: initialData?.recurring || true,
    notes: initialData?.notes || "",
    studentCount: initialData?.studentCount || 25,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter subject"
          />
        </div>
        <div>
          <Label htmlFor="teacher">Teacher</Label>
          <Input
            id="teacher"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            placeholder="Enter teacher"
          />
        </div>
        <div>
          <Label htmlFor="room">Room</Label>
          <Input
            id="room"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="Enter room"
          />
        </div>
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            placeholder="Enter grade"
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="Enter time"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            placeholder="Enter duration"
          />
        </div>
        <div>
          <Label htmlFor="day">Day</Label>
          <Input
            id="day"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            placeholder="Enter day"
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="Enter color"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Input
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            placeholder="Enter status"
          />
        </div>
        <div>
          <Label htmlFor="recurring">Recurring</Label>
          <Input
            id="recurring"
            value={formData.recurring}
            onChange={(e) => setFormData({ ...formData, recurring: e.target.value })}
            placeholder="Enter recurring"
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter notes"
          />
        </div>
        <div>
          <Label htmlFor="studentCount">Student Count</Label>
          <Input
            id="studentCount"
            type="number"
            value={formData.studentCount}
            onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
            placeholder="Enter student count"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button type="submit">{initialData ? "Update" : "Create"}</Button>
      </div>
    </form>
  )
}
