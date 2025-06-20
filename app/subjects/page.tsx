"use client"
import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Target,
  Award,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Home,
  Calendar,
  Settings,
  GraduationCap,
  MapPin,
} from "lucide-react"
import { SubjectForm } from "./SubjectForm" // Import SubjectForm component

interface Subject {
  id: number
  name: string
  code: string
  department: string
  description: string
  credits: number
  duration: number // in weeks
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  prerequisites: string[]
  objectives: string[]
  isActive: boolean
  enrolledStudents: number
  maxCapacity: number
  teachers: string[]
  schedule: {
    classesPerWeek: number
    totalHours: number
  }
  assessment: {
    assignments: number
    exams: number
    projects: number
    participation: number
  }
  resources: {
    textbooks: string[]
    materials: string[]
    equipment: string[]
  }
  performance: {
    averageGrade: number
    passRate: number
    completionRate: number
  }
  createdDate: Date
  lastUpdated: Date
}

interface Curriculum {
  id: number
  name: string
  description: string
  subjects: number[]
  totalCredits: number
  duration: string
  isActive: boolean
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

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH301",
    department: "Mathematics",
    description: "Advanced mathematical concepts including calculus, linear algebra, and statistics",
    credits: 4,
    duration: 16,
    difficulty: "Advanced",
    prerequisites: ["Basic Mathematics", "Algebra"],
    objectives: [
      "Master calculus concepts",
      "Understand linear algebra",
      "Apply statistical methods",
      "Solve complex mathematical problems",
    ],
    isActive: true,
    enrolledStudents: 28,
    maxCapacity: 30,
    teachers: ["Ms. Johnson", "Dr. Smith"],
    schedule: {
      classesPerWeek: 4,
      totalHours: 64,
    },
    assessment: {
      assignments: 40,
      exams: 30,
      projects: 20,
      participation: 10,
    },
    resources: {
      textbooks: ["Advanced Mathematics Textbook", "Calculus Guide"],
      materials: ["Calculator", "Graph Paper", "Ruler"],
      equipment: ["Graphing Calculator", "Computer Lab Access"],
    },
    performance: {
      averageGrade: 85.5,
      passRate: 92,
      completionRate: 96,
    },
    createdDate: new Date("2024-01-15"),
    lastUpdated: new Date("2024-01-20"),
  },
  {
    id: 2,
    name: "English Literature",
    code: "ENG201",
    department: "English",
    description: "Study of classic and contemporary literature with focus on critical analysis",
    credits: 3,
    duration: 16,
    difficulty: "Intermediate",
    prerequisites: ["Basic English"],
    objectives: [
      "Analyze literary works critically",
      "Understand historical context",
      "Develop writing skills",
      "Appreciate diverse literary forms",
    ],
    isActive: true,
    enrolledStudents: 25,
    maxCapacity: 28,
    teachers: ["Mr. Wilson"],
    schedule: {
      classesPerWeek: 3,
      totalHours: 48,
    },
    assessment: {
      assignments: 35,
      exams: 25,
      projects: 25,
      participation: 15,
    },
    resources: {
      textbooks: ["Literature Anthology", "Writing Guide"],
      materials: ["Notebooks", "Pens"],
      equipment: ["Library Access", "Computer Lab"],
    },
    performance: {
      averageGrade: 78.2,
      passRate: 88,
      completionRate: 94,
    },
    createdDate: new Date("2024-01-10"),
    lastUpdated: new Date("2024-01-18"),
  },
  {
    id: 3,
    name: "Chemistry Laboratory",
    code: "CHEM301",
    department: "Science",
    description: "Hands-on chemistry experiments and laboratory techniques",
    credits: 3,
    duration: 16,
    difficulty: "Advanced",
    prerequisites: ["Basic Chemistry", "Mathematics"],
    objectives: [
      "Master laboratory techniques",
      "Understand chemical reactions",
      "Practice safety protocols",
      "Analyze experimental data",
    ],
    isActive: true,
    enrolledStudents: 22,
    maxCapacity: 24,
    teachers: ["Dr. Brown"],
    schedule: {
      classesPerWeek: 2,
      totalHours: 48,
    },
    assessment: {
      assignments: 20,
      exams: 30,
      projects: 40,
      participation: 10,
    },
    resources: {
      textbooks: ["Chemistry Lab Manual"],
      materials: ["Lab Coat", "Safety Goggles", "Gloves"],
      equipment: ["Lab Equipment", "Chemicals", "Fume Hood"],
    },
    performance: {
      averageGrade: 82.1,
      passRate: 90,
      completionRate: 98,
    },
    createdDate: new Date("2024-01-12"),
    lastUpdated: new Date("2024-01-22"),
  },
]

const CURRICULUMS: Curriculum[] = [
  {
    id: 1,
    name: "Science Track",
    description: "Comprehensive science curriculum for advanced students",
    subjects: [1, 3],
    totalCredits: 7,
    duration: "2 semesters",
    isActive: true,
  },
  {
    id: 2,
    name: "Liberal Arts Track",
    description: "Balanced curriculum focusing on humanities and social sciences",
    subjects: [2],
    totalCredits: 3,
    duration: "1 semester",
    isActive: true,
  },
]

const DEPARTMENTS = ["Mathematics", "English", "Science", "History", "Arts", "Physical Education"] as const
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

const SearchIcon = Search // Declare SearchIcon variable
const FilterIcon = Filter // Declare FilterIcon variable

export default function SubjectsPage(): JSX.Element {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS)
  const [curriculums, setCurriculums] = useState<Curriculum[]>(CURRICULUMS)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCurriculumDialogOpen, setIsCurriculumDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("subjects")

  // Filter subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = departmentFilter === "all" || subject.department === departmentFilter
      const matchesDifficulty = difficultyFilter === "all" || subject.difficulty === difficultyFilter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && subject.isActive) ||
        (statusFilter === "inactive" && !subject.isActive)

      return matchesSearch && matchesDepartment && matchesDifficulty && matchesStatus
    })
  }, [subjects, searchTerm, departmentFilter, difficultyFilter, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSubjects = subjects.length
    const activeSubjects = subjects.filter((s) => s.isActive).length
    const totalStudents = subjects.reduce((sum, s) => sum + s.enrolledStudents, 0)
    const averageGrade = subjects.reduce((sum, s) => sum + s.performance.averageGrade, 0) / subjects.length
    const averagePassRate = subjects.reduce((sum, s) => sum + s.performance.passRate, 0) / subjects.length

    return {
      totalSubjects,
      activeSubjects,
      totalStudents,
      averageGrade: Math.round(averageGrade * 10) / 10,
      averagePassRate: Math.round(averagePassRate * 10) / 10,
    }
  }, [subjects])

  // CRUD operations
  const handleAddSubject = useCallback((newSubject: Omit<Subject, "id" | "createdDate" | "lastUpdated">) => {
    const subject: Subject = {
      ...newSubject,
      id: Date.now(),
      createdDate: new Date(),
      lastUpdated: new Date(),
    }
    setSubjects((prev) => [...prev, subject])
  }, [])

  const handleUpdateSubject = useCallback((updatedSubject: Subject) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === updatedSubject.id ? { ...updatedSubject, lastUpdated: new Date() } : subject,
      ),
    )
  }, [])

  const handleDeleteSubject = useCallback((subjectId: number) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId))
  }, [])

  const handleToggleStatus = useCallback((subjectId: number) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === subjectId ? { ...subject, isActive: !subject.isActive, lastUpdated: new Date() } : subject,
      ),
    )
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceColor = (value: number, type: "grade" | "rate") => {
    if (type === "grade") {
      if (value >= 90) return "text-green-600"
      if (value >= 80) return "text-yellow-600"
      return "text-red-600"
    } else {
      if (value >= 90) return "text-green-600"
      if (value >= 75) return "text-yellow-600"
      return "text-red-600"
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
              <p className="text-gray-600">Manage subjects, curriculum, and academic programs</p>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Subjects</p>
                  <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Subjects</p>
                  <p className="text-2xl font-bold">{stats.activeSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Grade</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(stats.averageGrade, "grade")}`}>
                    {stats.averageGrade}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(stats.averagePassRate, "rate")}`}>
                    {stats.averagePassRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full hidden md:inline-flex">
                    <FilterIcon className="w-4 h-4 mr-1" />
                    Advanced Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{subject.name}</h3>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant={subject.isActive ? "default" : "secondary"}>
                          {subject.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge className={getDifficultyColor(subject.difficulty)}>{subject.difficulty}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{subject.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="font-medium">{subject.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Credits</p>
                        <p className="font-medium">{subject.credits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Enrolled</p>
                        <p className="font-medium">
                          {subject.enrolledStudents}/{subject.maxCapacity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium">{subject.duration} weeks</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Enrollment</span>
                        <span>{Math.round((subject.enrolledStudents / subject.maxCapacity) * 100)}%</span>
                      </div>
                      <Progress value={(subject.enrolledStudents / subject.maxCapacity) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Avg Grade</p>
                        <p
                          className={`font-semibold ${getPerformanceColor(subject.performance.averageGrade, "grade")}`}
                        >
                          {subject.performance.averageGrade}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pass Rate</p>
                        <p className={`font-semibold ${getPerformanceColor(subject.performance.passRate, "rate")}`}>
                          {subject.performance.passRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Completion</p>
                        <p
                          className={`font-semibold ${getPerformanceColor(subject.performance.completionRate, "rate")}`}
                        >
                          {subject.performance.completionRate}%
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(subject.id)}>
                        <Target className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Curriculum Management
                  </div>
                  <Button onClick={() => setIsCurriculumDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Curriculum
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {curriculums.map((curriculum) => (
                    <div key={curriculum.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{curriculum.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{curriculum.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>
                              <strong>Subjects:</strong> {curriculum.subjects.length}
                            </span>
                            <span>
                              <strong>Credits:</strong> {curriculum.totalCredits}
                            </span>
                            <span>
                              <strong>Duration:</strong> {curriculum.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={curriculum.isActive ? "default" : "secondary"}>
                            {curriculum.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.slice(0, 5).map((subject) => (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{subject.name}</span>
                          <span>{subject.performance.averageGrade}%</span>
                        </div>
                        <Progress value={subject.performance.averageGrade} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {DEPARTMENTS.slice(0, 4).map((dept) => {
                      const count = subjects.filter((s) => s.department === dept).length
                      const percentage = Math.round((count / subjects.length) * 100)
                      return (
                        <div key={dept} className="flex items-center justify-between">
                          <span className="text-sm">{dept}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
