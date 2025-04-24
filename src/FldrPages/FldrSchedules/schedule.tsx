import { useState, useEffect, useMemo } from "react"
import { PlusCircle, Edit, Trash2, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import type { ProfessorCol } from "@/FldrTypes/professor.col"
import type { rateDesc } from "@/FldrTypes/rate"
import { toast } from "sonner"
import { formatTime } from "@/lib/dateFormatter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types based on the provided data structure
interface Schedule {
  pkedCode: string
  rowNum: number
  rdCode: string
  rdDesc: string
  pkRate: string
  yearCode: string
  yearDesc: string
  courseCode: string
  courseDesc: string
  semCode: string
  semDesc: string
  sectionCode: string
  sectionDesc: string
  professorCode: string
  professorName: string
  roomCode: string
  roomDesc: string
  scheduleDayCode: string
  scheduleDayDesc: string
  classStart: string
  classEnd: string
  aYearCode: string
  aYearDesc: string
}

interface ScheduleFormData {
  pkedCode: string
  pkRate: string
  professorCode: string
  roomCode: string
  scheduleDayCode: string
  classStart: string
  classEnd: string
}

// Helper function to convert time string to minutes for easier comparison
const timeToMinutes = (time: string): number => {
  if (!time) return 0
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper function to get the day index (0 = Monday, 6 = Sunday)
const getDayIndex = (day: string): number => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  return days.findIndex((d) => d.toLowerCase() === day.toLowerCase())
}

// Helper function to generate a consistent color based on pkedCode
const getColorForPkedCode = (pkedCode: string) => {
  // Predefined color palette (pastel colors that work well with dark text)
  const colors = [
    { bg: "bg-blue-100", border: "border-blue-300", hover: "hover:bg-blue-200" },
    { bg: "bg-green-100", border: "border-green-300", hover: "hover:bg-green-200" },
    { bg: "bg-yellow-100", border: "border-yellow-300", hover: "hover:bg-yellow-200" },
    { bg: "bg-purple-100", border: "border-purple-300", hover: "hover:bg-purple-200" },
    { bg: "bg-pink-100", border: "border-pink-300", hover: "hover:bg-pink-200" },
    { bg: "bg-indigo-100", border: "border-indigo-300", hover: "hover:bg-indigo-200" },
    { bg: "bg-red-100", border: "border-red-300", hover: "hover:bg-red-200" },
    { bg: "bg-orange-100", border: "border-orange-300", hover: "hover:bg-orange-200" },
    { bg: "bg-teal-100", border: "border-teal-300", hover: "hover:bg-teal-200" },
    { bg: "bg-cyan-100", border: "border-cyan-300", hover: "hover:bg-cyan-200" },
  ]

  // Simple hash function to get a consistent index based on pkedCode
  let hash = 0
  for (let i = 0; i < pkedCode.length; i++) {
    hash = (hash << 5) - hash + pkedCode.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }

  // Use absolute value and modulo to get an index within the colors array
  const colorIndex = Math.abs(hash) % colors.length
  return colors[colorIndex]
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([])
  const [enrollDesc, setEnrollDesc] = useState<Schedule[]>([])
  const [subjects, setSubjects] = useState<rateDesc[]>([])
  const [professors, setProfessors] = useState<ProfessorCol[]>([])
  const [rooms, setRooms] = useState<{ roomCode: string; roomDesc: string }[]>([])
  const [days, setDays] = useState<{ scheduleDayCode: string; scheduleDayDesc: string }[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filterValue, setFilterValue] = useState("")
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleFormData>({
    pkedCode: "",
    pkRate: "",
    professorCode: "",
    roomCode: "",
    scheduleDayCode: "",
    classStart: "",
    classEnd: "",
  })

  // Time slots for the timetable (7:00 AM to 9:00 PM in 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = []
    for (let hour = 1; hour <= 24  ; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        slots.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return slots
  }, [])

  // Days of the week
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Create a map of pkedCode to course info for the legend
  // const courseColorMap = useMemo(() => {
  //   const uniqueCodes = [...new Set(filteredSchedules.map((s) => s.pkedCode))]
  //   return uniqueCodes.map((code) => {
  //     const schedule = filteredSchedules.find((s) => s.pkedCode === code)
  //     return {
  //       pkedCode: code,
  //       courseInfo: schedule ? `${schedule.courseDesc} - ${schedule.yearDesc} (${schedule.sectionDesc})` : code,
  //       color: getColorForPkedCode(code),
  //     }
  //   })
  // }, [filteredSchedules])

  const getSchedules = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/Schedule/ListSchedules`)

      if (res.status === 200) {
        setSchedules(res.data)
        setFilteredSchedules(res.data)
      } else {
        setSchedules([])
        setFilteredSchedules([])
      }
    } catch (error) {
      console.log("Error fetching schedules:", error)
    }
  }

  const getProfessors = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/api/Professors`)

      if (res.status === 200) {
        setProfessors(res.data)
      }
    } catch (error) {
      console.log("Error fetching professors:", error)
    }
  }

  const getEnrollDesc = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/api/EnrollDescription`)

      if (res.status === 200) {
        setEnrollDesc(res.data)
      }
    } catch (error) {
      console.log("Error fetching enrollment descriptions:", error)
    }
  }

  const getRoom = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListRoom`)

      if (res.status === 200) {
        setRooms(res.data)
      }
    } catch (error) {
      console.log("Error fetching rooms:", error)
    }
  }

  const getScheduleDay = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListScheduleDay`)

      if (res.status === 200) {
        setDays(res.data)
      }
    } catch (error) {
      console.log("Error fetching schedule days:", error)
    }
  }

  const getSubjects = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListRateWithDesc`)

      if (res.status === 200) {
        setSubjects(res.data)
      }
    } catch (error) {
      console.log("Error fetching subjects:", error)
    }
  }

  useEffect(() => {
    getSchedules()
    getEnrollDesc()
    getProfessors()
    getRoom()
    getScheduleDay()
    getSubjects()
  }, [])

  useEffect(() => {
    // Filter schedules based on filter value
    if (filterValue && filterValue !== "all") {
      setFilteredSchedules(schedules.filter((schedule) => schedule.pkedCode === filterValue))
    } else {
      setFilteredSchedules(schedules)
    }
  }, [filterValue, schedules])

  const handleAddSchedule = () => {
    setCurrentSchedule({
      pkedCode: "",
      pkRate: "",
      professorCode: "",
      roomCode: "",
      scheduleDayCode: "",
      classStart: "",
      classEnd: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setCurrentSchedule({
      pkedCode: schedule.pkedCode,
      pkRate: schedule.pkRate,
      professorCode: schedule.professorCode,
      roomCode: schedule.roomCode,
      scheduleDayCode: schedule.scheduleDayCode,
      classStart: schedule.classStart,
      classEnd: schedule.classEnd,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteSchedule = (pkedCode: string) => {
    // In a real application, this would call an API to delete the schedule
    setSchedules(schedules.filter((schedule) => schedule.pkedCode !== pkedCode))
    setFilteredSchedules(filteredSchedules.filter((schedule) => schedule.pkedCode !== pkedCode))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      console.log("Submitting schedule data:", currentSchedule)

      const res = await axios.post(`${plsConnect()}/API/WebAPI/Schedule/PostSchedule`, currentSchedule)

      if (res.status === 200) {
        getSchedules()
        toast.success("Schedule added successfully")
        setIsDialogOpen(false)
      } else {
        toast.error("Failed to add schedule")
      }
    } catch (error) {
      console.error("Error submitting schedule:", error)
      toast.error("An error occurred while saving the schedule")
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    setFilterValue("")
  }

  // Function to check if a schedule falls within a specific time slot
  const isScheduleInTimeSlot = (schedule: Schedule, timeSlot: string, dayIndex: number) => {
    const scheduleDay = getDayIndex(schedule.scheduleDayDesc)
    if (scheduleDay !== dayIndex) return false

    const slotMinutes = timeToMinutes(timeSlot)
    const startMinutes = timeToMinutes(schedule.classStart)
    const endMinutes = timeToMinutes(schedule.classEnd)

    return slotMinutes >= startMinutes && slotMinutes < endMinutes
  }

  // Function to get schedules for a specific time slot and day
  const getSchedulesForTimeSlot = (timeSlot: string, dayIndex: number) => {
    return filteredSchedules.filter((schedule) => isScheduleInTimeSlot(schedule, timeSlot, dayIndex))
  }

  // Calculate the height of a schedule based on its duration
  const getScheduleHeight = (schedule: Schedule) => {
    const startMinutes = timeToMinutes(schedule.classStart)
    const endMinutes = timeToMinutes(schedule.classEnd)
    const durationInMinutes = endMinutes - startMinutes
    // Each 30 minutes corresponds to a height of 3rem (48px)
    return `${(durationInMinutes / 30) * 3}rem`
  }

  // Calculate the top position of a schedule based on its start time
  const getScheduleTopPosition = (schedule: Schedule, timeSlot: string) => {
    const slotMinutes = timeToMinutes(timeSlot)
    const startMinutes = timeToMinutes(schedule.classStart)
    const offsetMinutes = startMinutes - slotMinutes
    // Each 30 minutes corresponds to a height of 3rem (48px)
    return `${(offsetMinutes / 30) * 3}rem`
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Class Schedules</CardTitle>
            <CardDescription>View and manage class schedules for courses</CardDescription>
          </div>
          <Button onClick={handleAddSchedule}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schedules</SelectItem>
                  {enrollDesc.map((desc) => (
                    <SelectItem key={desc.pkedCode} value={desc.pkedCode}>
                      {desc.courseDesc} - {desc.yearDesc} ({desc.sectionDesc})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterValue && filterValue !== "all" && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filter
              </Button>
            )}
          </div>

          {/* Color Legend */}
          {/* {courseColorMap.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {courseColorMap.map(({ pkedCode, courseInfo, color }) => (
                <div key={pkedCode} className="flex items-center">
                  <div className={`h-4 w-4 rounded ${color.bg} ${color.border} mr-1`}></div>
                  <span className="text-xs">{courseInfo}</span>
                </div>
              ))}
            </div>
          )} */}

          {filteredSchedules.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Timetable header */}
                <div className="grid grid-cols-8 border-b">
                  <div className="p-2 text-center font-medium text-muted-foreground">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="p-2 text-center font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Timetable body */}
                <div className="relative">
                  {timeSlots.map((timeSlot, index) => (
                    <div key={timeSlot} className={`grid grid-cols-8 ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
                      <div className="border-r p-2 text-center text-sm text-muted-foreground h-12">
                        {formatTime(timeSlot)}
                      </div>

                      {/* Day columns */}
                      {weekDays.map((day, dayIndex) => (
                        <div key={`${day}-${timeSlot}`} className="relative border-r h-12">
                          {/* Render schedules that start at this time slot */}
                          {index % 2 === 0 &&
                            getSchedulesForTimeSlot(timeSlot, dayIndex).map((schedule) => {
                              const colorStyle = getColorForPkedCode(schedule.pkedCode)
                              return (
                                <TooltipProvider key={`${schedule.pkedCode}-${timeSlot}`}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`absolute left-0 right-0 mx-1 rounded ${colorStyle.bg} ${colorStyle.border} ${colorStyle.hover} p-1 overflow-hidden cursor-pointer transition-colors`}
                                        style={{
                                          height: getScheduleHeight(schedule),
                                          top: getScheduleTopPosition(schedule, timeSlot),
                                          zIndex: 10,
                                        }}
                                        onClick={() => handleEditSchedule(schedule)}
                                      >
                                        <div className="text-xs font-medium truncate">{schedule.rdDesc}</div>
                                        <div className="text-xs truncate">{schedule.roomDesc}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                          {schedule.professorName}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1">
                                        <p className="font-medium">{schedule.rdDesc}</p>
                                        <p>
                                          {schedule.courseDesc} - {schedule.yearDesc} ({schedule.sectionDesc})
                                        </p>
                                        <p>Professor: {schedule.professorName}</p>
                                        <p>Room: {schedule.roomDesc}</p>
                                        <p>Academic Year: {schedule.aYearDesc}</p>
                                        <p>
                                          Time: {formatTime(schedule.classStart)} - {formatTime(schedule.classEnd)}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-black"
                                            onClick={() => handleEditSchedule(schedule)}
                                          >
                                            <Edit className="h-3 w-3 mr-1" /> Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-black"
                                            onClick={() => handleDeleteSchedule(schedule.pkedCode)}
                                          >
                                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                                          </Button>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No schedules found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {filterValue ? "Try adjusting your filters" : "Add your first schedule to get started"}
              </p>
              {!filterValue && (
                <Button onClick={handleAddSchedule}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              )}
              {filterValue && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
        {filteredSchedules.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredSchedules.length} of {schedules.length} schedules
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentSchedule.pkedCode ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
            <DialogDescription>Fill in the details for the class schedule</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedulefor" className="text-right">
                Schedule For
              </Label>
              <div className="col-span-3">
                <Select
                  value={currentSchedule.pkedCode}
                  onValueChange={(value) => setCurrentSchedule({ ...currentSchedule, pkedCode: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Schedule For" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollDesc.map((desc) => (
                      <SelectItem key={desc.pkedCode} value={desc.pkedCode}>
                        {desc.courseDesc} - {desc.yearDesc} ({desc.sectionDesc})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="professor" className="text-right">
                Professor
              </Label>
              <div className="col-span-3">
                <Select
                  value={currentSchedule.professorCode}
                  onValueChange={(value) => setCurrentSchedule({ ...currentSchedule, professorCode: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((professor) => (
                      <SelectItem key={professor.professorCode} value={professor.professorCode}>
                        {professor.professorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subjects
              </Label>
              <div className="col-span-3">
                <Select
                  value={currentSchedule.pkRate}
                  onValueChange={(value) => setCurrentSchedule({ ...currentSchedule, pkRate: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.pkRate} value={subject.pkRate}>
                        {subject.rdDesc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <div className="col-span-3">
                <Select
                  value={currentSchedule.roomCode}
                  onValueChange={(value) => setCurrentSchedule({ ...currentSchedule, roomCode: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.roomCode} value={room.roomCode}>
                        {room.roomDesc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right">
                Day
              </Label>
              <div className="col-span-3">
                <Select
                  value={currentSchedule.scheduleDayCode}
                  onValueChange={(value) => setCurrentSchedule({ ...currentSchedule, scheduleDayCode: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day.scheduleDayCode} value={day.scheduleDayCode}>
                        {day.scheduleDayDesc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <div className="col-span-3">
                <Input
                  value={currentSchedule.classStart}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, classStart: e.target.value })}
                  type="time"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <div className="col-span-3">
                <Input
                  value={currentSchedule.classEnd}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, classEnd: e.target.value })}
                  type="time"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className={`${isLoading && "animated-pulse"}`}>
              {isLoading ? "Adding..." : currentSchedule.pkedCode ? "Update Schedule" : "Add Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
