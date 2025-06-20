"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface SubjectFormProps {
  onSubmit: (item: any) => void
  onCancel: () => void
}

export const SubjectForm = ({ onSubmit, onCancel }: SubjectFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "Mathematics",
    description: "",
    credits: 3,
    duration: 16,
    difficulty: "Intermediate",
    prerequisites: [],
    objectives: [],
    isActive: true,
    enrolledStudents: 0,
    maxCapacity: 30,
    teachers: [],
    schedule: {
      classesPerWeek: 3,
      totalHours: 48,
    },
    assessment: {
      assignments: 30,
      exams: 30,
      projects: 20,
      participation: 20,
    },
    resources: {
      textbooks: [],
      materials: [],
      equipment: [],
    },
    performance: {
      averageGrade: 75,
      passRate: 90,
      completionRate: 95,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const DEPARTMENTS = ["Mathematics", "English", "Science", "History", "Arts", "Physical Education"] as const
  const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Subject Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter subject name"
          />
        </div>
        <div>
          <Label htmlFor="code">Subject Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Enter subject code"
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
            placeholder="Enter credits"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (weeks)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            placeholder="Enter duration"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description"
          />
        </div>
        <div>
          <Label htmlFor="maxCapacity">Max Capacity</Label>
          <Input
            id="maxCapacity"
            type="number"
            value={formData.maxCapacity}
            onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
            placeholder="Enter max capacity"
          />
        </div>
        <div>
          <Label htmlFor="averageGrade">Average Grade</Label>
          <Input
            id="averageGrade"
            type="number"
            value={formData.performance.averageGrade}
            onChange={(e) =>
              setFormData({
                ...formData,
                performance: { ...formData.performance, averageGrade: Number(e.target.value) },
              })
            }
            placeholder="Enter average grade"
          />
        </div>
        <div>
          <Label htmlFor="passRate">Pass Rate</Label>
          <Input
            id="passRate"
            type="number"
            value={formData.performance.passRate}
            onChange={(e) =>
              setFormData({ ...formData, performance: { ...formData.performance, passRate: Number(e.target.value) } })
            }
            placeholder="Enter pass rate"
          />
        </div>
        <div>
          <Label htmlFor="completionRate">Completion Rate</Label>
          <Input
            id="completionRate"
            type="number"
            value={formData.performance.completionRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                performance: { ...formData.performance, completionRate: Number(e.target.value) },
              })
            }
            placeholder="Enter completion rate"
          />
        </div>
        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}
