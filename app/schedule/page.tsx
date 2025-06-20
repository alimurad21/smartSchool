"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  RefreshCw,
  Filter,
  Search,
  Users,
  MapPin,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Eye,
  Home,
  Settings,
  GraduationCap,
} from "lucide-react"
import { ScheduleItemForm } from "./ScheduleItemForm"

interface ScheduleItem {
  id: number
  subject: string
  teacher: string
  room: string
  grade: string
  time: string
  duration: number
  day: string
  color: string
  status: "active" | "cancelled" | "modified"
  recurring: boolean
  notes?: string
  studentCount: number
}

interface ScheduleTemplate {
  id: number
  name: string
  description: string
  isActive: boolean
  scheduleItems: ScheduleItem[]
  createdDate: Date
  lastModified: Date
}

const menuItems = [
{ name: "Dashboard", href: "/", icon: Calendar, roles: ["admin", "teacher", "student"] },
  { name: "Schedule", href: "/schedule", icon: Calendar, roles: ["admin", "teacher", "student"] },
  { name: "Teachers", href: "/teachers", icon: Users, roles: ["admin"] },
  { name: "Students", href: "/students", icon: GraduationCap, roles: ["admin", "teacher"] },
  { name: "Rooms", href: "/rooms", icon: MapPin, roles: ["admin"] },
  { name: "Subjects", href: "/subjects", icon: BookOpen, roles: ["admin", "teacher"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
]

const INITIAL_SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Ms. Johnson",
    room: "Room 101",
    grade: "Grade 10",
    time: "09:00",
    duration: 60,
    day: "Monday",
    color: "bg-blue-500",
    status: "active",
    recurring: true,
    studentCount: 28,
    notes: "Advanced algebra concepts",
  },
  {
    id: 2,
    subject: "English Literature",
    teacher: "Mr. Smith",
    room: "Room 102",
    grade: "Grade 9",
    time: "10:00",
    duration: 60,
    day: "Monday",
    color: "bg-green-500",
    status: "active",
    recurring: true,
    studentCount: 25,
  },
  {
    id: 3,
    subject: "Chemistry",
    teacher: "Dr. Brown",
    room: "Lab A",
    grade: "Grade 11",
    time: "11:00",
    duration: 90,
    day: "Monday",
    color: "bg-purple-500",
    status: "active",
    recurring: true,
    studentCount: 22,
    notes: "Lab safety required",
  },
  {
    id: 4,
    subject: "Physical Education",
    teacher: "Ms. Davis",
    room: "Gymnasium",
    grade: "Grade 12",
    time: "14:00",
    duration: 60,
    day: "Monday",
    color: "bg-orange-500",
    status: "cancelled",
    recurring: true,
    studentCount: 30,
    notes: "Equipment maintenance",
  },
  {
    id: 5,
    subject: "History",
    teacher: "Mr. Wilson",
    room: "Room 201",
    grade: "Grade 11",
    time: "13:00",
    duration: 60,
    day: "Tuesday",
    color: "bg-red-500",
    status: "modified",
    recurring: true,
    studentCount: 26,
    notes: "Time changed from 12:00",
  },
]

const SCHEDULE_TEMPLATES: ScheduleTemplate[] = [
  {
    id: 1,
    name: "Standard Weekly Schedule",
    description: "Regular weekly schedule for all grades",
    isActive: true,
    scheduleItems: INITIAL_SCHEDULE_ITEMS,
    createdDate: new Date("2024-01-15"),
    lastModified: new Date("2024-01-20"),
  },
  {
    id: 2,
    name: "Exam Week Schedule",
    description: "Modified schedule for examination periods",
    isActive: false,
    scheduleItems: [],
    createdDate: new Date("2024-01-10"),
    lastModified: new Date("2024-01-18"),
  },
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] as const
const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] as const
const TEACHERS = ["Ms. Johnson", "Mr. Smith", "Dr. Brown", "Ms. Davis", "Mr. Wilson"] as const
const ROOMS = ["Room 101", "Room 102", "Room 201", "Lab A", "Lab B", "Gymnasium", "Library", "Art Room"] as const

const JSX = "JSX" // Declare JSX variable

export default function SchedulePage(): JSX.Element {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(INITIAL_SCHEDULE_ITEMS)
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(SCHEDULE_TEMPLATES)
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all")
  const [selectedRoom, setSelectedRoom] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null)
  const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)

  // Filter schedule items
  const filteredScheduleItems = useMemo(() => {
    return scheduleItems.filter((item) => {
      const matchesSearch =
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.room.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDay = selectedDay === "all" || item.day === selectedDay
      const matchesGrade = selectedGrade === "all" || item.grade === selectedGrade
      const matchesTeacher = selectedTeacher === "all" || item.teacher === selectedTeacher
      const matchesRoom = selectedRoom === "all" || item.room === selectedRoom
      const matchesStatus = statusFilter === "all" || item.status === statusFilter

      return matchesSearch && matchesDay && matchesGrade && matchesTeacher && matchesRoom && matchesStatus
    })
  }, [scheduleItems, searchTerm, selectedDay, selectedGrade, selectedTeacher, selectedRoom, statusFilter])

  // Get items for specific time slot
  const getItemsForSlot = useCallback(
    (day: string, time: string) => {
      return filteredScheduleItems.filter((item) => item.day === day && item.time === time)
    },
    [filteredScheduleItems],
  )

  // Handle drag and drop
  const handleDragStart = useCallback((e: React.DragEvent, item: ScheduleItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, day: string, time: string) => {
      e.preventDefault()
      if (!draggedItem) return

      const updatedItems = scheduleItems.map((item) =>
        item.id === draggedItem.id ? { ...item, day, time, status: "modified" as const } : item,
      )

      setScheduleItems(updatedItems)
      setDraggedItem(null)
    },
    [draggedItem, scheduleItems],
  )

  // CRUD operations
  const handleAddScheduleItem = useCallback((newItem: Omit<ScheduleItem, "id">) => {
    const item: ScheduleItem = {
      ...newItem,
      id: Date.now(),
    }
    setScheduleItems((prev) => [...prev, item])
  }, [])

  const handleUpdateScheduleItem = useCallback((updatedItem: ScheduleItem) => {
    setScheduleItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }, [])

  const handleDeleteScheduleItem = useCallback((itemId: number) => {
    setScheduleItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const handleDuplicateScheduleItem = useCallback((item: ScheduleItem) => {
    const duplicatedItem: ScheduleItem = {
      ...item,
      id: Date.now(),
      time: "09:00", // Default time for duplicated item
    }
    setScheduleItems((prev) => [...prev, duplicatedItem])
  }, [])

  // Template operations
  const handleSaveAsTemplate = useCallback(() => {
    const newTemplate: ScheduleTemplate = {
      id: Date.now(),
      name: `Template ${templates.length + 1}`,
      description: "Custom schedule template",
      isActive: false,
      scheduleItems: [...scheduleItems],
      createdDate: new Date(),
      lastModified: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }, [scheduleItems, templates.length])

  const handleLoadTemplate = useCallback(
    (templateId: number) => {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        setScheduleItems(template.scheduleItems)
        setSelectedTemplate(templateId)
      }
    },
    [templates],
  )

  // Bulk operations
  const handleBulkStatusUpdate = useCallback((status: ScheduleItem["status"]) => {
    setScheduleItems((prev) => prev.map((item) => ({ ...item, status })))
  }, [])

  const handleExportSchedule = useCallback(() => {
    const dataStr = JSON.stringify(scheduleItems, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "schedule.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }, [scheduleItems])

  const getStatusColor = (status: ScheduleItem["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "modified":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: ScheduleItem["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />
      case "cancelled":
        return <AlertTriangle className="w-3 h-3" />
      case "modified":
        return <Edit className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Main Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">SmartSchedule</h2>
                <p className="text-xs text-gray-500">School Planner</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <a href={item.href} className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <header className="bg-white border-b px-3 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                <SidebarTrigger />
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                    <span className="hidden sm:inline">Schedule Management</span>
                    <span className="sm:hidden">Schedule</span>
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                    Create, manage, and optimize class schedules
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <Select
                  value={selectedTemplate.toString()}
                  onValueChange={(value) => handleLoadTemplate(Number(value))}
                >
                  <SelectTrigger className="w-32 sm:w-48 h-8 md:h-10 text-xs md:text-sm">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleSaveAsTemplate} className="hidden sm:flex">
                  <Copy className="w-4 h-4 mr-1" />
                  Save Template
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportSchedule} className="hidden md:flex">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 md:h-10">
                      <Plus className="w-4 h-4 mr-0 sm:mr-1" />
                      <span className="hidden sm:inline">Add Class</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Class</DialogTitle>
                    </DialogHeader>
                    <ScheduleItemForm
                      onSubmit={(item) => {
                        handleAddScheduleItem(item)
                        setIsAddDialogOpen(false)
                      }}
                      onCancel={() => setIsAddDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Filters and Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Filter className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Filters & Controls</span>
                  <span className="sm:hidden">Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="relative col-span-2 sm:col-span-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 md:top-3 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 md:h-10 text-sm"
                    />
                  </div>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          <span className="hidden sm:inline">{day}</span>
                          <span className="sm:hidden">{day.slice(0, 3)}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="Teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {TEACHERS.map((teacher) => (
                        <SelectItem key={teacher} value={teacher}>
                          {teacher}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      {ROOMS.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="modified">Modified</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions - Mobile optimized */}
                <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-4 border-t">
                  <span className="text-xs md:text-sm text-gray-600">Actions:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate("active")}
                    className="text-xs"
                  >
                    <span className="hidden sm:inline">Mark All </span>Active
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate("cancelled")}
                    className="text-xs"
                  >
                    <span className="hidden sm:inline">Cancel All</span>
                    <span className="sm:hidden">Cancel</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Auto-Optimize</span>
                    <span className="sm:hidden">Optimize</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Content */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
              <TabsList className="hidden">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Weekly Schedule Grid
                      <Badge variant="outline" className="ml-auto">
                        {filteredScheduleItems.length} classes
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="min-w-[1000px]">
                        {/* Header */}
                        <div className="grid grid-cols-6 gap-2 mb-4">
                          <div className="font-semibold text-center py-2">Time</div>
                          {DAYS.map((day) => (
                            <div key={day} className="font-semibold text-center py-2 bg-gray-50 rounded">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Time slots */}
                        {TIME_SLOTS.map((time) => (
                          <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                            <div className="flex items-center justify-center py-4 font-medium text-gray-600 bg-gray-50 rounded">
                              {time}
                            </div>
                            {DAYS.map((day) => (
                              <div
                                key={`${day}-${time}`}
                                className="min-h-[100px] p-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day, time)}
                              >
                                {getItemsForSlot(day, time).map((item) => (
                                  <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    className={`${item.color} text-white p-3 rounded-lg mb-1 cursor-move hover:opacity-90 transition-opacity relative`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">{item.subject}</span>
                                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                        {getStatusIcon(item.status)}
                                      </Badge>
                                    </div>
                                    <div className="text-xs opacity-90 space-y-1">
                                      <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{item.teacher}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{item.room}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{item.duration}min</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{item.studentCount} students</span>
                                      </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs mt-2">
                                      {item.grade}
                                    </Badge>
                                    <div className="absolute top-1 right-1 flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-white hover:bg-white/20"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedItem(item)
                                        }}
                                      >
                                        <Eye className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-white hover:bg-white/20"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDuplicateScheduleItem(item)
                                        }}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Schedule List View
                      <Badge variant="outline" className="ml-auto">
                        {filteredScheduleItems.length} classes
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredScheduleItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded ${item.color}`} />
                            <div>
                              <h4 className="font-medium">{item.subject}</h4>
                              <p className="text-sm text-gray-600">
                                {item.day} at {item.time} • {item.duration} minutes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{item.teacher}</p>
                              <p className="text-xs text-gray-600">{item.room}</p>
                            </div>
                            <Badge variant="outline">{item.grade}</Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status}</span>
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDuplicateScheduleItem(item)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteScheduleItem(item.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Schedule Item Detail Dialog */}
            {selectedItem && (
              <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Class - {selectedItem.subject}</DialogTitle>
                  </DialogHeader>
                  <ScheduleItemForm
                    initialData={selectedItem}
                    onSubmit={(updatedItem) => {
                      handleUpdateScheduleItem({ ...updatedItem, id: selectedItem.id })
                      setSelectedItem(null)
                    }}
                    onCancel={() => setSelectedItem(null)}
                    onDelete={() => {
                      handleDeleteScheduleItem(selectedItem.id)
                      setSelectedItem(null)
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
