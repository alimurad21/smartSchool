"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Download,
  PrinterIcon as Print,
  Home,
  Settings,
  BookOpen,
  Users,
} from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  grade: string
  studentId: string
  schedule: ScheduleItem[]
  gpa: number
  attendance: number
  parent: {
    name: string
    email: string
    phone: string
  }
}

interface ScheduleItem {
  id: number
  subject: string
  teacher: string
  room: string
  time: string
  day: string
  duration: number
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

const SAMPLE_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@student.school.edu",
    grade: "Grade 10",
    studentId: "ST2024001",
    gpa: 3.8,
    attendance: 95,
    parent: {
      name: "Robert Johnson",
      email: "robert.johnson@email.com",
      phone: "(555) 123-4567",
    },
    schedule: [
      {
        id: 1,
        subject: "Mathematics",
        teacher: "Ms. Johnson",
        room: "Room 101",
        time: "09:00",
        day: "Monday",
        duration: 60,
      },
      {
        id: 2,
        subject: "English",
        teacher: "Mr. Smith",
        room: "Room 102",
        time: "10:00",
        day: "Monday",
        duration: 60,
      },
      {
        id: 3,
        subject: "Science",
        teacher: "Dr. Brown",
        room: "Lab A",
        time: "11:00",
        day: "Monday",
        duration: 90,
      },
    ],
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob.wilson@student.school.edu",
    grade: "Grade 11",
    studentId: "ST2024002",
    gpa: 3.5,
    attendance: 88,
    parent: {
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "(555) 234-5678",
    },
    schedule: [
      {
        id: 4,
        subject: "History",
        teacher: "Mr. Davis",
        room: "Room 201",
        time: "09:00",
        day: "Monday",
        duration: 60,
      },
      {
        id: 5,
        subject: "Physics",
        teacher: "Dr. Brown",
        room: "Lab B",
        time: "10:00",
        day: "Monday",
        duration: 90,
      },
    ],
  },
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
const SAMPLE_STUDENTS_VAR = SAMPLE_STUDENTS // Declare SAMPLE_STUDENTS_VAR to fix the lint error

export default function StudentsPage(): JSX.Element {
  const [students, setStudents] = useState<Student[]>(SAMPLE_STUDENTS_VAR)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")

  const grades = Array.from(new Set(students.map((s) => s.grade)))

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter

    return matchesSearch && matchesGrade
  })

  const handleExportSchedule = useCallback((student: Student) => {
    // Simulate PDF export
    console.log(`Exporting schedule for ${student.name}`)
  }, [])

  const handlePrintSchedule = useCallback((student: Student) => {
    // Simulate print
    console.log(`Printing schedule for ${student.name}`)
  }, [])

  const getScheduleForDay = useCallback((schedule: ScheduleItem[], day: string) => {
    return schedule.filter((item) => item.day === day)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">Student Portal</span>
                <span className="sm:hidden">Students</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                View student schedules and information
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Student List</TabsTrigger>
            <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                      Export All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.studentId}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{student.grade}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{student.parent.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{student.parent.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-t">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">GPA</p>
                        <p className="font-semibold text-lg">{student.gpa}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Attendance</p>
                        <p className="font-semibold text-lg">{student.attendance}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        View Schedule
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportSchedule(student)}>
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePrintSchedule(student)}>
                        <Print className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            {selectedStudent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Schedule for {selectedStudent.name}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExportSchedule(selectedStudent)}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePrintSchedule(selectedStudent)}>
                        <Print className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
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
                          {DAYS.map((day) => {
                            const daySchedule = getScheduleForDay(selectedStudent.schedule, day)
                            const classAtTime = daySchedule.find((item) => item.time === time)

                            return (
                              <div
                                key={`${day}-${time}`}
                                className="min-h-[80px] p-2 border border-gray-200 rounded-lg"
                              >
                                {classAtTime && (
                                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                                    <div className="font-medium text-sm">{classAtTime.subject}</div>
                                    <div className="text-xs opacity-90 space-y-1">
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{classAtTime.teacher}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{classAtTime.room}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{classAtTime.duration}min</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Student Selected</h3>
                  <p className="text-gray-500">Select a student from the list to view their schedule</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
