import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Schedule, ScheduleItem } from "@/FldrTypes/schedule"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const COURSES = ["BSIT", "BSCS", "BSECE", "BSCpE", "BSBA", "BSA", "BEED", "BSED"]

interface AddScheduleFormProps {
  onAddSchedule: (newItem: Omit<ScheduleItem, "id">) => boolean
  existingSchedule: Schedule
}

export function AddScheduleForm({ onAddSchedule, existingSchedule }: AddScheduleFormProps) {
  const [formData, setFormData] = useState({
    course: "",
    section: "",
    subject: "",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
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

  // Check for potential conflicts based on room and day
  const checkPotentialConflicts = (data: typeof formData) => {
    if (!data.room || !data.day) {
      setPotentialConflicts([])
      return
    }

    const conflicts = existingSchedule.filter((item) => item.room === data.room && item.day === data.day)

    setPotentialConflicts(conflicts)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.course ||
      !formData.section ||
      !formData.subject ||
      !formData.day ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.room ||
      !formData.professor
    ) {
      toast("Error", {
        description: "Please fill in all fields",
      })
      return
    }

    // Time validation
    const startTime = formData.startTime.split(":").map(Number)
    const endTime = formData.endTime.split(":").map(Number)
    const startMinutes = startTime[0] * 60 + startTime[1]
    const endMinutes = endTime[0] * 60 + endTime[1]

    if (startMinutes >= endMinutes) {
      toast("Error", {
        description: "End time must be after start time",
      })
      return
    }

    // Try to add the schedule
    const success = onAddSchedule(formData)

    // If successful, reset form
    if (success) {
      setFormData({
        course: "",
        section: "",
        subject: "",
        day: "",
        startTime: "",
        endTime: "",
        room: "",
        professor: "",
      })
      setPotentialConflicts([])
    }
  }

  // Get unique sections for the selected course
  const getSectionsForCourse = () => {
    if (!formData.course) return []

    const sections = existingSchedule.filter((item) => item.course === formData.course).map((item) => item.section)

    return Array.from(new Set(sections))
  }

  // Get unique rooms
  const rooms = Array.from(new Set(existingSchedule.map((item) => item.room)))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select value={formData.course} onValueChange={(value) => handleSelectChange("course", value)}>
            <SelectTrigger className="w-full" id="course">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {COURSES.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <div className="flex gap-2">
            <Select value={formData.section} onValueChange={(value) => handleSelectChange("section", value)}>
              <SelectTrigger id="section" className="flex-1">
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {getSectionsForCourse().length > 0
                  ? getSectionsForCourse().map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))
                  : ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"].map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Computer Programming 1"
          />
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
              name="startTime"
              type="time"
              min="07:30"
              max="22:00"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              min="07:30"
              max="22:00"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">Room</Label>
          <div className="flex gap-2">
            <Select value={formData.room} onValueChange={(value) => handleSelectChange("room", value)}>
              <SelectTrigger id="room" className="flex-1">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
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
                  {conflict.startTime} - {conflict.endTime}: {conflict.subject} ({conflict.course} {conflict.section})
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

