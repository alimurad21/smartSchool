"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  MapPin,
  Users,
  Monitor,
  Volume2,
  Camera,
  Plus,
  Edit,
  Trash2,
  CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Settings,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

interface Room {
  id: number
  name: string
  type: string
  capacity: number
  equipment: string[]
  isAvailable: boolean
  bookings: Booking[]
  features: string[]
  notes: string
}

interface Booking {
  id: number
  title: string
  teacher: string
  subject: string
  time: string
  duration: number
  day: string
  recurring: boolean
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

const INITIAL_ROOMS: Room[] = [
  {
    id: 1,
    name: "Room 101",
    type: "Classroom",
    capacity: 30,
    equipment: ["Projector", "Whiteboard", "Computer"],
    isAvailable: true,
    features: ["Air Conditioning", "WiFi", "Sound System"],
    notes: "Recently renovated. Perfect for presentations.",
    bookings: [
      {
        id: 1,
        title: "Mathematics Class",
        teacher: "Ms. Johnson",
        subject: "Algebra",
        time: "09:00",
        duration: 60,
        day: "Monday",
        recurring: true,
      },
      {
        id: 2,
        title: "Parent Meeting",
        teacher: "Ms. Johnson",
        subject: "Meeting",
        time: "15:00",
        duration: 30,
        day: "Friday",
        recurring: false,
      },
    ],
  },
  {
    id: 2,
    name: "Lab A",
    type: "Science Lab",
    capacity: 24,
    equipment: ["Microscopes", "Lab Benches", "Fume Hood", "Safety Equipment"],
    isAvailable: true,
    features: ["Emergency Shower", "Gas Lines", "Ventilation"],
    notes: "Chemistry and Biology lab. Safety protocols required.",
    bookings: [
      {
        id: 3,
        title: "Chemistry Experiment",
        teacher: "Dr. Brown",
        subject: "Chemistry",
        time: "11:00",
        duration: 90,
        day: "Monday",
        recurring: true,
      },
    ],
  },
  {
    id: 3,
    name: "Gymnasium",
    type: "Sports Facility",
    capacity: 100,
    equipment: ["Basketball Hoops", "Volleyball Net", "Sound System", "Scoreboard"],
    isAvailable: false,
    features: ["Locker Rooms", "Storage", "First Aid Station"],
    notes: "Under maintenance until next week.",
    bookings: [],
  },
]

const ROOM_TYPES = ["Classroom", "Science Lab", "Computer Lab", "Sports Facility", "Auditorium", "Library"]

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const roomTypes = Array.from(new Set(rooms.map((r) => r.type)))

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || room.type === typeFilter
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && room.isAvailable) ||
      (availabilityFilter === "unavailable" && !room.isAvailable)

    return matchesSearch && matchesType && matchesAvailability
  })

  const handleToggleAvailability = useCallback((roomId: number) => {
    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, isAvailable: !room.isAvailable } : room)))
  }, [])

  const handleDeleteRoom = useCallback((roomId: number) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId))
  }, [])

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment.toLowerCase()) {
      case "projector":
      case "computer":
        return <Monitor className="w-4 h-4" />
      case "sound system":
        return <Volume2 className="w-4 h-4" />
      case "cameras":
        return <Camera className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">Room Management</span>
                <span className="sm:hidden">Rooms</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                Manage rooms and facilities
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg truncate">{room.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{room.type}</p>
                    </div>
                  </div>
                  <Badge variant={room.isAvailable ? "default" : "secondary"}>
                    {room.isAvailable ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Unavailable
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Capacity: {room.capacity} people</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.slice(0, 3).map((item) => (
                      <Badge key={item} variant="outline" className="text-xs">
                        {getEquipmentIcon(item)}
                        <span className="ml-1">{item}</span>
                      </Badge>
                    ))}
                    {room.equipment.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.equipment.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Today's Bookings</h4>
                  {room.bookings.length > 0 ? (
                    <div className="space-y-1">
                      {room.bookings.slice(0, 2).map((booking) => (
                        <div key={booking.id} className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                          <Clock className="w-3 h-3" />
                          <span>
                            {booking.time} - {booking.title}
                          </span>
                        </div>
                      ))}
                      {room.bookings.length > 2 && (
                        <p className="text-xs text-gray-500">+{room.bookings.length - 2} more bookings</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No bookings today</p>
                  )}
                </div>

                {room.notes && (
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <p className="text-gray-700">{room.notes}</p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRoom(room)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleAvailability(room.id)}>
                    {room.isAvailable ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default RoomsPage
