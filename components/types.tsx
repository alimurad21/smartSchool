export interface ScheduleItem {
  id: number
  subject: string
  teacher: string
  room: string
  grade: string
  time: string
  duration: number
  day: string
  color: string
}

export interface ScheduleGridProps {
  scheduleData: ScheduleItem[]
  filters: {
    selectedGrade: string
    selectedTeacher: string
    selectedRoom: string
  }
  onScheduleUpdate: (updatedSchedule: ScheduleItem[]) => void
}
