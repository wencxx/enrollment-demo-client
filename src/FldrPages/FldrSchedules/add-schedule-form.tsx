import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Schedule, ScheduleItem } from "@/FldrTypes/schedule"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import axios from "axios"
import { plsConnect } from "@/FldrClass/ClsGetConnection"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface AddScheduleFormProps {
  onAddSchedule: (newItem: Omit<ScheduleItem, "scheduleCode">) => Promise<boolean>
  existingSchedule: Schedule
}

interface Courses {
  courseCode: string
  courseDesc: string
}

interface Years {
  yearCode: string
  yearDesc: string
}

interface Subjects {
  subjectCode: string
  subjectDesc: string
  prerequisiteCode: string | null
}

export function AddScheduleForm({ onAddSchedule, existingSchedule }: AddScheduleFormProps) {
  const [courses, setCourses] = useState<Courses[]>([])
  const [years, setYears] = useState<Years[]>([])
  const [subjects, setSubjects] = useState<Subjects[]>([])

  const getCourses = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListCourse`)

      setCourses(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getYears = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListYear`)

      setYears(res.data)
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
    getYears()
    getSubjects()
  }, [])

  // add schedule logic
  const [formData, setFormData] = useState({
    courseCode: "",
    yearCode: "",
    section: "",
    subjectCode: "",
    day: "",
    timeStart: "",
    timeEnd: "",
    roomCode: "",
    professor: "",
  })

  const [potentialConflicts, setPotentialConflicts] = useState<ScheduleItem[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Check for potential conflicts when room or day changes
    if (name === "room" || name === "day" || name === "startTime" || name === "endTime") {
      checkPotentialConflicts({ ...formData, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Check for potential conflicts when room or day changes
    if (name === "room" || name === "day") {
      checkPotentialConflicts({ ...formData, [name]: value })
    }
  }

  // Check for potential conflicts based on room, day, and time
  const checkPotentialConflicts = (data: typeof formData) => {
    if (!data.roomCode || !data.day || !data.timeStart || !data.timeEnd) {
      setPotentialConflicts([])
      return
    }

    const conflicts = existingSchedule.filter((item) => {
      if (item.roomCode === data.roomCode && item.day === data.day) {
        const existingStart = item.timeStart.split(":").map(Number)
        const existingEnd = item.timeEnd.split(":").map(Number)
        const newStart = data.timeStart.split(":").map(Number)
        const newEnd = data.timeEnd.split(":").map(Number)

        const existingStartMinutes = existingStart[0] * 60 + existingStart[1]
        const existingEndMinutes = existingEnd[0] * 60 + existingEnd[1]
        const newStartMinutes = newStart[0] * 60 + newStart[1]
        const newEndMinutes = newEnd[0] * 60 + newEnd[1]

        return (
          (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
          (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
          (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
        )
      }
      return false
    })

    setPotentialConflicts(conflicts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.courseCode ||
      !formData.yearCode ||
      !formData.section ||
      !formData.subjectCode ||
      !formData.day ||
      !formData.timeStart ||
      !formData.timeEnd ||
      !formData.roomCode ||
      !formData.professor
    ) {
      toast("Error", {
        description: "Please fill in all fields",
      })
      return
    }

    // Time validation
    const startTime = formData.timeStart.split(":").map(Number)
    const endTime = formData.timeEnd.split(":").map(Number)
    const startMinutes = startTime[0] * 60 + startTime[1]
    const endMinutes = endTime[0] * 60 + endTime[1]

    if (startMinutes >= endMinutes) {
      toast("Error", {
        description: "End time must be after start time",
      })
      return
    }

    // Prevent submission if there are conflicts
    if (potentialConflicts.length > 0) {
      toast("Error", {
        description: "There are scheduling conflicts. Please resolve them before submitting.",
      })
      return
    }

    // Try to add the schedule
    const success = await onAddSchedule(formData)

    // If successful, reset form
    if (success) {
      setFormData({
        courseCode: "",
        yearCode: "",
        section: "",
        subjectCode: "",
        day: "",
        timeStart: "",
        timeEnd: "",
        roomCode: "",
        professor: "",
      })
      setPotentialConflicts([])
    }
  }

  // Get unique rooms
  const rooms = [
    {
      roomCode: 'R0001',
      roomName: 'Comlab 1',
      status: 'Available',
    },
    {
      roomCode: 'R0002',
      roomName: 'Comlab 2',
      status: 'Available',
    }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select value={formData.courseCode} onValueChange={(value) => handleSelectChange("courseCode", value)}>
            <SelectTrigger className="w-full" id="course">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.courseCode} value={course.courseCode}>
                  {course.courseDesc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <div className="flex gap-2">
              <Select value={formData.yearCode} onValueChange={(value) => handleSelectChange("yearCode", value)}>
                <SelectTrigger id="year" className="flex-1">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.yearCode} value={year.yearCode}>
                      {year.yearDesc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <div className="flex gap-2">
              <Select value={formData.section} onValueChange={(value) => handleSelectChange("section", value)}>
                <SelectTrigger id="section" className="flex-1">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select value={formData.subjectCode} onValueChange={(value) => handleSelectChange("subjectCode", value)}>
            <SelectTrigger id="subject" className="flex-1 w-full">
              <SelectValue placeholder="Select Subjects" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.subjectCode} value={subject.subjectCode}>
                  {subject.subjectDesc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="professor">Professor</Label>
          <Input
            id="professor"
            name="professor"
            value={formData.professor}
            onChange={handleChange}
            placeholder="e.g. Prof. Santos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Select value={formData.day} onValueChange={(value) => handleSelectChange("day", value)}>
            <SelectTrigger className="w-full" id="day">
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="timeStart"
              type="time"
              min="07:30"
              max="22:00"
              value={formData.timeStart}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              name="timeEnd"
              type="time"
              min="07:30"
              max="22:00"
              value={formData.timeEnd}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">Room</Label>
          <div className="flex gap-2">
            <Select value={formData.roomCode} onValueChange={(value) => handleSelectChange("roomCode", value)}>
              <SelectTrigger id="room" className="flex-1">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.roomCode} value={room.roomCode}>
                    {room.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {potentialConflicts.length > 0 && (
        <Alert variant="warning" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Potential Conflicts</AlertTitle>
          <AlertDescription>
            <p>The selected room is already scheduled for these times on {formData.day}:</p>
            <ul className="mt-2 text-sm">
              {potentialConflicts.map((conflict) => (
                <li key={conflict.id} className="mb-1">
                  {conflict.timeStart} - {conflict.timeEnd}: {conflict.subjectCode} ({conflict.courseCode} {conflict.section})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full">
        Add Schedule
      </Button>
    </form>
  )
}

