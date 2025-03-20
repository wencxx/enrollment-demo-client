import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleDisplay } from "@/FldrPages/FldrSchedules/schedule-display"
import { AddScheduleForm } from "@/FldrPages/FldrSchedules/add-schedule-form"
import { FilterControls } from "@/FldrPages/FldrSchedules/filter-controls"
import type { Schedule, ScheduleItem } from "@/FldrTypes/schedule"
import { toast } from "sonner"

const initialSchedule: Schedule = [
  {
    id: "1",
    course: "BSIT",
    section: "1A",
    subject: "Computer Programming 1",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:30",
    room: "ComLab 1",
    professor: "Prof. Santos",
  },
  {
    id: "2",
    course: "BSIT",
    section: "1A",
    subject: "Mathematics in the Modern World",
    day: "Monday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room 101",
    professor: "Prof. Reyes",
  },
  {
    id: "3",
    course: "BSCS",
    section: "1B",
    subject: "Data Structures and Algorithms",
    day: "Tuesday",
    startTime: "13:00",
    endTime: "14:30",
    room: "ComLab 2",
    professor: "Prof. Cruz",
  },
  {
    id: "4",
    course: "BSIT",
    section: "2A",
    subject: "Web Development",
    day: "Wednesday",
    startTime: "15:00",
    endTime: "16:30",
    room: "ComLab 1",
    professor: "Prof. Garcia",
  },
  {
    id: "5",
    course: "BSCS",
    section: "2B",
    subject: "Database Management",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    room: "ComLab 3",
    professor: "Prof. Mendoza",
  },
]

export default function Schedules() {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule)
  const [filters, setFilters] = useState({
    course: "",
    section: "",
    subject: "",
  })

  // Check for scheduling conflicts
  const hasScheduleConflict = (newItem: Omit<ScheduleItem, "id">) => {
    return schedule.some((item) => {
      // Check if same day and room
      if (item.day === newItem.day && item.room === newItem.room) {
        // Convert times to minutes for easier comparison
        const existingStart = timeToMinutes(item.startTime)
        const existingEnd = timeToMinutes(item.endTime)
        const newStart = timeToMinutes(newItem.startTime)
        const newEnd = timeToMinutes(newItem.endTime)

        // Check for overlap
        return (
          (newStart >= existingStart && newStart < existingEnd) || // New start time is during existing schedule
          (newEnd > existingStart && newEnd <= existingEnd) || // New end time is during existing schedule
          (newStart <= existingStart && newEnd >= existingEnd) // New schedule completely contains existing schedule
        )
      }
      return false
    })
  }

  // Convert time string (HH:MM) to minutes
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const addScheduleItem = (newItem: Omit<ScheduleItem, "id">) => {
    // Check for conflicts
    if (hasScheduleConflict(newItem)) {
      toast("Scheduling Conflict", {
        description: `Room ${newItem.room} is already booked during this time on ${newItem.day}.`,
      })
      return false
    }

    const id = Math.random().toString(36).substring(2, 9)
    setSchedule([...schedule, { ...newItem, id }])

    toast("Schedule added", {
      description: `Successfully added ${newItem.subject} for ${newItem.course} ${newItem.section}.`,
    })
    return true
  } 

  const filteredSchedule = schedule.filter((item) => {
    return (
      (filters.course === "" || item.course === filters.course) &&
      (filters.section === "" || item.section === filters.section) &&
      (filters.subject === "" || item.subject.toLowerCase().includes(filters.subject.toLowerCase()))
    )
  })

  // Get unique values for filters
  const courses = Array.from(new Set(schedule.map((item) => item.course)))
  const sections = Array.from(new Set(schedule.map((item) => item.section)))

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Class Schedule</h1>
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="view">View Schedule</TabsTrigger>
          <TabsTrigger value="add">Add Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Class Schedule (7:30 AM - 10:00 PM)</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterControls filters={filters} setFilters={setFilters} courses={courses} sections={sections} />

              <div className="mt-6">
                <ScheduleDisplay schedule={filteredSchedule} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Add New Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <AddScheduleForm onAddSchedule={addScheduleItem} existingSchedule={schedule} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

