"use client";

import { useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Settings,
  Home,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleGrid } from "@/components/schedule-grid";
import { ConflictPanel } from "@/components/conflict-panel";
import { StatsCards } from "@/components/stats-cards";
import { NotificationSystem } from "@/components/notification-system";
import { ScheduleOptimizer } from "@/components/schedule-optimizer";
import { AdvancedAnalytics } from "@/components/advanced-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
// Types
interface ScheduleItem {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  grade: string;
  time: string;
  duration: number;
  day: string;
  color: string;
}

interface Conflict {
  id: number;
  type: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  time: string;
}

// Constants
const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] as const;
const TEACHERS = [
  "Ms. Johnson",
  "Mr. Smith",
  "Dr. Brown",
  "Ms. Davis",
  "Mr. Wilson",
] as const;
const ROOMS = [
  "Room 101",
  "Room 102",
  "Lab A",
  "Lab B",
  "Gym",
  "Library",
] as const;
const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Physical Education",
  "Art",
] as const;

const menuItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Calendar,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Schedule",
    href: "/schedule",
    icon: Calendar,
    roles: ["admin", "teacher", "student"],
  },
  { name: "Teachers", href: "/teachers", icon: Users, roles: ["admin"] },
  {
    name: "Students",
    href: "/students",
    icon: GraduationCap,
    roles: ["admin", "teacher"],
  },
  { name: "Rooms", href: "/rooms", icon: MapPin, roles: ["admin"] },
  {
    name: "Subjects",
    href: "/subjects",
    icon: BookOpen,
    roles: ["admin", "teacher"],
  },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
];

// Initial data
const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: 1,
    type: "overlap",
    message: "Ms. Johnson scheduled in Room 101 and Lab A at 10:00 AM",
    severity: "high",
    time: "10:00 AM",
  },
  {
    id: 2,
    type: "absence",
    message: "Mr. Smith marked absent - 3 classes need reassignment",
    severity: "critical",
    time: "Today",
  },
];

const INITIAL_SCHEDULE: ScheduleItem[] = [
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
  },
  {
    id: 2,
    subject: "English",
    teacher: "Mr. Smith",
    room: "Room 102",
    grade: "Grade 9",
    time: "10:00",
    duration: 60,
    day: "Monday",
    color: "bg-green-500",
  },
  {
    id: 3,
    subject: "Science",
    teacher: "Dr. Brown",
    room: "Lab A",
    grade: "Grade 11",
    time: "11:00",
    duration: 90,
    day: "Monday",
    color: "bg-purple-500",
  },
  {
    id: 4,
    subject: "Physical Education",
    teacher: "Ms. Davis",
    room: "Gym",
    grade: "Grade 12",
    time: "14:00",
    duration: 60,
    day: "Monday",
    color: "bg-orange-500",
  },
  {
    id: 5,
    subject: "History",
    teacher: "Mr. Wilson",
    room: "Room 102",
    grade: "Grade 11",
    time: "13:00",
    duration: 60,
    day: "Tuesday",
    color: "bg-red-500",
  },
  {
    id: 6,
    subject: "Art",
    teacher: "Ms. Davis",
    room: "Art Room",
    grade: "Grade 9",
    time: "15:00",
    duration: 90,
    day: "Wednesday",
    color: "bg-pink-500",
  },
];

export default function SchoolScheduler(): JSX.Element {
  const { user, loading } = useAuth()
  // State management using React hooks

  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [conflicts, setConflicts] = useState<Conflict[]>(INITIAL_CONFLICTS);
  const [scheduleData, setScheduleData] =
    useState<ScheduleItem[]>(INITIAL_SCHEDULE);



  // Memoized conflict detection function
  const checkForConflicts = useCallback((schedule: ScheduleItem[]): void => {
    const newConflicts: Conflict[] = [];

    // Check for room conflicts
    const roomConflicts = schedule.filter((item, index) =>
      schedule.some(
        (other, otherIndex) =>
          index !== otherIndex &&
          item.room === other.room &&
          item.day === other.day &&
          item.time === other.time
      )
    );

    if (roomConflicts.length > 0) {
      newConflicts.push({
        id: Date.now(),
        type: "overlap",
        message: `Room conflict detected: ${roomConflicts[0].room} at ${roomConflicts[0].time}`,
        severity: "high",
        time: roomConflicts[0].time,
      });
    }

    // Check for teacher conflicts
    const teacherConflicts = schedule.filter((item, index) =>
      schedule.some(
        (other, otherIndex) =>
          index !== otherIndex &&
          item.teacher === other.teacher &&
          item.day === other.day &&
          item.time === other.time
      )
    );

    if (teacherConflicts.length > 0) {
      newConflicts.push({
        id: Date.now() + 1,
        type: "teacher_overlap",
        message: `Teacher conflict: ${teacherConflicts[0].teacher} scheduled in multiple classes at ${teacherConflicts[0].time}`,
        severity: "critical",
        time: teacherConflicts[0].time,
      });
    }

    setConflicts((prevConflicts) => [
      ...prevConflicts.filter((c) => c.type === "absence"), // Keep absence conflicts
      ...newConflicts,
    ]);
  }, []);

  // Event handlers
  const handleScheduleUpdate = useCallback(
    (updatedSchedule: ScheduleItem[]): void => {
      setScheduleData(updatedSchedule);
      checkForConflicts(updatedSchedule);
    },
    [checkForConflicts]
  );



  const handleConflictResolve = useCallback((conflictId: number): void => {
    setConflicts((prevConflicts) =>
      prevConflicts.filter((c) => c.id !== conflictId)
    );
  }, []);

  const handleGradeChange = useCallback((value: string): void => {
    setSelectedGrade(value);
  }, []);

  const handleTeacherChange = useCallback((value: string): void => {
    setSelectedTeacher(value);
  }, []);

  const handleRoomChange = useCallback((value: string): void => {
    setSelectedRoom(value);
  }, []);

          if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <div className="flex flex-col items-center justify-center min-h-screen">Please sign in to access the dashboard.
    <Button className="mt-4" asChild>
      <Link href="/auth/login">Sign In</Link>
    </Button>
    </div>
  }
  
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">
                  School Schedule Dashboard
                </span>
                <span className="sm:hidden">Dashboard</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                Manage and optimize your school's timetable
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <NotificationSystem />
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs md:text-sm"
            >
              <Clock className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="hidden md:block">
              <StatsCards />
            </div>

            {/* Mobile Stats - Condensed version */}
            <div className="block md:hidden">
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold">156</p>
                    <p className="text-xs text-gray-600">Classes</p>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold">3</p>
                    <p className="text-xs text-gray-600">Conflicts</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Conflicts Alert - Mobile optimized */}
            {conflicts.length > 0 && (
              <div className="block">
                <ConflictPanel
                  conflicts={conflicts}
                  onResolve={handleConflictResolve}
                />
              </div>
            )}

            {/* Quick Schedule Overview */}
            <div className="block">
              <ScheduleGrid
                scheduleData={scheduleData}
                filters={{ selectedGrade, selectedTeacher, selectedRoom }}
                onScheduleUpdate={handleScheduleUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 md:space-y-6">
            {/* Filters - Mobile optimized */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    Filters & Controls
                  </span>
                  <span className="sm:hidden">Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Grade
                    </label>
                    <Select
                      value={selectedGrade}
                      onValueChange={handleGradeChange}
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue placeholder="Select grade" />
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
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Teacher
                    </label>
                    <Select
                      value={selectedTeacher}
                      onValueChange={handleTeacherChange}
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue placeholder="Select teacher" />
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
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="text-sm font-medium mb-1 block">
                      Room
                    </label>
                    <Select
                      value={selectedRoom}
                      onValueChange={handleRoomChange}
                    >
                      <SelectTrigger className="h-9 md:h-10">
                        <SelectValue placeholder="Select room" />
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Grid - Mobile optimized */}
            <div className="block">
              <ScheduleGrid
                scheduleData={scheduleData}
                filters={{ selectedGrade, selectedTeacher, selectedRoom }}
                onScheduleUpdate={handleScheduleUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="optimizer">
            <ScheduleOptimizer />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// "use client"

// import { useAuth } from "@/lib/auth-context"
// import { RoleGuard } from "@/components/auth/role-guard"

// export default function Dashboard() {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>
//   }

//   if (!user) {
//     return <div className="flex items-center justify-center min-h-screen">Please sign in to access the dashboard.</div>
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-3xl font-semibold mb-5">Dashboard</h1>

//       <section className="mb-8">
//         <h2 className="text-2xl font-semibold mb-3">Welcome, {user.email}!</h2>
//         <p>This is your dashboard. You can manage your account and access various features here.</p>
//       </section>

//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-3">Account Information</h2>
//         <p>Email: {user.email}</p>
//         <p>Role: {user.role}</p>
//       </section>

//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-3">Admin Only Section</h2>
//         <RoleGuard allowedRoles={["admin"]}>
//           <div>
//             <p>This section is only visible to administrators.</p>
//             {/* Admin-only content like teacher management, room management, etc. */}
//           </div>
//         </RoleGuard>
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold mb-3">Other Features</h2>
//         <ul>
//           <li>Feature 1</li>
//           <li>Feature 2</li>
//           <li>Feature 3</li>
//         </ul>
//       </section>
//     </div>
//   )
// }
