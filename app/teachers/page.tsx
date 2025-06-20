"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  BookOpen,
  Home,
  Settings,
  GraduationCap,
  MapPin,
} from "lucide-react"

interface Teacher {
  id: number
  name: string
  email: string
  phone: string
  department: string
  subjects: string[]
  isActive: boolean
  totalClasses: number
  weeklyHours: number
  availability: {
    [key: string]: string[]
  }
  notes: string
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

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Ms. Johnson",
    email: "johnson@school.edu",
    phone: "(555) 123-4567",
    department: "Mathematics",
    subjects: ["Algebra", "Geometry", "Calculus"],
    isActive: true,
    totalClasses: 18,
    weeklyHours: 25,
    availability: {
      Monday: ["09:00", "10:00", "11:00", "14:00"],
      Tuesday: ["08:00", "09:00", "13:00", "15:00"],
      Wednesday: ["10:00", "11:00", "14:00", "15:00"],
      Thursday: ["09:00", "10:00", "13:00", "14:00"],
      Friday: ["08:00", "09:00", "10:00", "11:00"],
    },
    notes: "Prefers morning classes. Available for extra tutoring sessions.",
  },
  {
    id: 2,
    name: "Mr. Smith",
    email: "smith@school.edu",
    phone: "(555) 234-5678",
    department: "English",
    subjects: ["Literature", "Creative Writing", "Grammar"],
    isActive: false,
    totalClasses: 15,
    weeklyHours: 20,
    availability: {
      Monday: ["10:00", "11:00", "13:00"],
      Tuesday: ["09:00", "10:00", "14:00"],
      Wednesday: ["08:00", "11:00", "15:00"],
      Thursday: ["10:00", "13:00", "14:00"],
      Friday: ["09:00", "10:00", "13:00"],
    },
    notes: "Currently on medical leave. Expected return: Next month.",
  },
  {
    id: 3,
    name: "Dr. Brown",
    email: "brown@school.edu",
    phone: "(555) 345-6789",
    department: "Science",
    subjects: ["Physics", "Chemistry", "Biology"],
    isActive: true,
    totalClasses: 22,
    weeklyHours: 30,
    availability: {
      Monday: ["08:00", "09:00", "10:00", "13:00", "14:00"],
      Tuesday: ["09:00", "10:00", "11:00", "15:00"],
      Wednesday: ["08:00", "10:00", "13:00", "14:00"],
      Thursday: ["09:00", "11:00", "13:00", "15:00"],
      Friday: ["08:00", "09:00", "14:00", "15:00"],
    },
    notes: "Department head. Handles lab equipment maintenance.",
  },
]

export default function TeachersPage(): JSX.Element {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const departments = Array.from(new Set(teachers.map((t) => t.department)))

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || teacher.department === departmentFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && teacher.isActive) ||
      (statusFilter === "inactive" && !teacher.isActive)

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleToggleStatus = useCallback((teacherId: number) => {
    setTeachers((prev) =>
      prev.map((teacher) => (teacher.id === teacherId ? { ...teacher, isActive: !teacher.isActive } : teacher)),
    )
  }, [])

  const handleDeleteTeacher = useCallback((teacherId: number) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId))
  }, [])

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">Teacher Management</span>
                <span className="sm:hidden">Teachers</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                Manage faculty information and availability
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        {/* Filters */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div>
                <Label htmlFor="search" className="text-sm">
                  Search Teachers
                </Label>
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 md:h-10 text-sm"
                />
              </div>
              <div>
                <Label className="text-sm">Department</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full h-9 md:h-10 text-sm">
                  Export List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 p-4 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base md:text-lg truncate">{teacher.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{teacher.department}</p>
                    </div>
                  </div>
                  <Badge variant={teacher.isActive ? "default" : "secondary"} className="text-xs flex-shrink-0">
                    {teacher.isActive ? (
                      <>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{teacher.subjects.join(", ")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Classes</span>
                    </div>
                    <p className="font-semibold">{teacher.totalClasses}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Hours/Week</span>
                    </div>
                    <p className="font-semibold">{teacher.weeklyHours}</p>
                  </div>
                </div>

                {teacher.notes && (
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <p className="text-gray-700 line-clamp-2">{teacher.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleStatus(teacher.id)}>
                    {teacher.isActive ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTeacher(teacher.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Teacher Detail Dialog */}
        {selectedTeacher && (
          <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Teacher Details - {selectedTeacher.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Basic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <Label>Name</Label>
                      <Input value={selectedTeacher.name} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={selectedTeacher.email} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={selectedTeacher.phone} />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input value={selectedTeacher.department} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={selectedTeacher.isActive} />
                      <Label>Active Status</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Weekly Availability</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedTeacher.availability).map(([day, times]) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="w-20 text-sm font-medium">{day}:</span>
                        <div className="flex flex-wrap gap-1">
                          {times.map((time) => (
                            <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedTeacher(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setSelectedTeacher(null)}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
