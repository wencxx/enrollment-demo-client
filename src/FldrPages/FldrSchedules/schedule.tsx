import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleDisplay } from "@/FldrPages/FldrSchedules/schedule-display"
import { AddScheduleForm } from "@/FldrPages/FldrSchedules/add-schedule-form"
import { FilterControls } from "@/FldrPages/FldrSchedules/filter-controls"
import type { Schedule, ScheduleItem } from "@/FldrTypes/schedule"
import { toast } from "sonner"
import axios from "axios"
import { plsConnect } from '@/FldrClass/ClsGetConnection'

interface Courses {
  courseCode: string
  courseDesc: string
}

interface Subjects {
  subjectCode: string
  subjectDesc: string
  prerequisiteCode: string | null
}

export default function Schedules() {
  const [schedule, setSchedule] = useState<Schedule>([])
  const [filters, setFilters] = useState({
    courseCode: "",
    section: "",
    subjectCode: "",
  })

  // get schedule
  const getSchedules = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/api/Schedule`)

      setSchedule(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSchedules()
  }, [])

  // Check for scheduling conflicts
  const hasScheduleConflict = (newItem: Omit<ScheduleItem, "scheduleCode">) => {
    const conflict = schedule.some((item) => {
      // Check if same day and room
      if (item.day === newItem.day && item.roomCode === newItem.roomCode) {
        // Convert times to minutes for easier comparison
        const existingStart = timeToMinutes(item.timeStart)
        const existingEnd = timeToMinutes(item.timeEnd)
        const newStart = timeToMinutes(newItem.timeStart)
        const newEnd = timeToMinutes(newItem.timeEnd)

        // Check for overlap
        return (
          (newStart >= existingStart && newStart < existingEnd) || // New start time is during existing schedule
          (newEnd > existingStart && newEnd <= existingEnd) || // New end time is during existing schedule
          (newStart <= existingStart && newEnd >= existingEnd) // New schedule completely contains existing schedule
        )
      }
      return false
    })

    if (conflict) {
      console.error("Conflict detected:", newItem)
    }

    return conflict
  }

  // Convert time string (HH:MM) to minutes
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const addScheduleItem = async (newItem: Omit<ScheduleItem, "scheduleCode">) => {
    // Check for conflicts
    if (hasScheduleConflict(newItem)) {
      toast("Scheduling Conflict", {
        description: `Room ${newItem.roomCode} is already booked during this time on ${newItem.day}.`,
      })
      return false
    }

    try {
      const res = await axios.post(`${plsConnect()}/api/Schedule`, newItem)

      // Update local schedule state
      // setSchedule((prev) => [
      //   ...prev,
      //   { ...newItem, id: res.data.id }, // Assuming the API returns the new item's ID
      // ])

      toast("Added schedule successfully")
      return true
    } catch (error) {
      toast("Failed adding schedule")
      return false
    }
  }

  const filteredSchedule = schedule.filter((item) => {
    return (
      (filters.courseCode === "" || item.courseCode === filters.courseCode) &&
      (filters.section === "" || item.section === filters.section) &&
      (filters.subjectCode === "" || item.subjectCode.toLowerCase().includes(filters.subjectCode.toLowerCase()))
    )
  })

  // Get unique values for filters
  const [courses, setCourses] = useState<Courses[]>([])
  const [subjects, setSubjects] = useState<Subjects[]>([])

  const getCourses = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListCourse`)

      setCourses(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getSubjects = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListSubject`)

      setSubjects(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCourses()
    getSubjects()
  }, [])
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
              <FilterControls filters={filters} setFilters={setFilters} courses={courses}  subjects={subjects} />

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

