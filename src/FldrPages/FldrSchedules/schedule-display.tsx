import { useState } from "react"
import type { Schedule } from "@/FldrTypes/schedule"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const TIME_SLOTS = generateTimeSlots("07:30", "22:00", 30)

function generateTimeSlots(start: string, end: string, intervalMinutes: number) {
  const slots = []
  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)

  let currentHour = startHour
  let currentMinute = startMinute

  while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
    const formattedHour = currentHour.toString().padStart(2, "0")
    const formattedMinute = currentMinute.toString().padStart(2, "0")
    slots.push(`${formattedHour}:${formattedMinute}`)

    currentMinute += intervalMinutes
    if (currentMinute >= 60) {
      currentHour += 1
      currentMinute -= 60
    }
  }

  return slots
}

function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number)
  const period = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
}

interface ScheduleDisplayProps {
  schedule: Schedule
}

export function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  const [activeView, setActiveView] = useState<"week" | "day" | "section">("week")
  const [activeDay, setActiveDay] = useState(DAYS[0])
  const [activeSection, setActiveSection] = useState<string>("")

  // Get all unique sections
  const sections = Array.from(new Set(schedule.map((item) => `${item.course} ${item.section}`)))

  // If no active section is set but we have sections, set the first one
  if (activeSection === "" && sections.length > 0 && activeView === "section") {
    setActiveSection(sections[0])
  }

  const getScheduleForTimeSlot = (day: string, timeSlot: string, sectionFilter?: string) => {
    return schedule.filter((item) => {
      // Apply section filter if in section view
      if (sectionFilter) {
        const itemSectionString = `${item.course} ${item.section}`
        if (itemSectionString !== sectionFilter) return false
      }

      if (item.day !== day) return false

      const [slotHour, slotMinute] = timeSlot.split(":").map(Number)
      const [startHour, startMinute] = item.startTime.split(":").map(Number)
      const [endHour, endMinute] = item.endTime.split(":").map(Number)

      const slotTime = slotHour * 60 + slotMinute
      const startTime = startHour * 60 + startMinute
      const endTime = endHour * 60 + endMinute

      return slotTime >= startTime && slotTime < endTime
    })
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "week" | "day" | "section")}>
          <TabsList>
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="day">Day View</TabsTrigger>
            <TabsTrigger value="section">Section View</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeView === "day" && (
          <Tabs value={activeDay} onValueChange={setActiveDay}>
            <TabsList>
              {DAYS.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {activeView === "section" && sections.length > 0 && (
          <Select value={activeSection} onValueChange={(value) => setActiveSection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sections</SelectLabel>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {activeView === "week" ? (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b">
              <div className="p-2 font-medium text-center">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="p-2 font-medium text-center">
                  {day}
                </div>
              ))}
            </div>

            {TIME_SLOTS.map((timeSlot, index) => (
              <div
                key={timeSlot}
                className={cn("grid grid-cols-[100px_repeat(6,1fr)] border-b", index % 2 === 0 ? "bg-muted/30" : "")}
              >
                <div className="p-2 text-sm text-center">{formatTime(timeSlot)}</div>

                {DAYS.map((day) => {
                  const items = getScheduleForTimeSlot(day, timeSlot)
                  return (
                    <div key={day} className="p-1 border-l min-h-[50px]">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-primary/10 text-primary p-1 text-xs rounded mb-1 overflow-hidden"
                          title={`${item.subject} - ${item.professor} - ${item.room}`}
                        >
                          <div className="font-medium truncate w-[100px] lg:w-[150px]">{item.subject}</div>
                          <div className="flex items-center gap-1 text-[10px] font-medium">
                              {item.course} {item.section}
                          </div>
                          <div className="truncate text-[10px]">{item.room}</div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ) : activeView === "day" ? (
        <div>
          <div className="grid grid-cols-[100px_1fr] border-b">
            <div className="p-2 font-medium text-center">Time</div>
            <div className="p-2 font-medium text-center">{activeDay}</div>
          </div>

          {TIME_SLOTS.map((timeSlot, index) => {
            const items = getScheduleForTimeSlot(activeDay, timeSlot)
            return (
              <div
                key={timeSlot}
                className={cn("grid grid-cols-[100px_1fr] border-b", index % 2 === 0 ? "bg-muted/30" : "")}
              >
                <div className="p-2 text-sm text-center">{formatTime(timeSlot)}</div>
                <div className="p-1 border-l min-h-[60px]">
                  {items.map((item) => (
                    <div key={item.id} className="bg-primary/10 text-primary p-2 text-sm rounded mb-1">
                      <div className="font-medium">{item.subject}</div>
                      <div className="flex items-center gap-1 mt-1 text-[13px]">
                          {item.course} {item.section}
                      </div>
                      <div className="text-xs mt-1">
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </div>
                      <div className="text-xs">Room: {item.room}</div>
                      <div className="text-xs">Prof: {item.professor}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b">
            <div className="p-2 font-medium text-center">Time</div>
            {DAYS.map((day) => (
              <div key={day} className="p-2 font-medium text-center">
                {day}
              </div>
            ))}
          </div>

          {TIME_SLOTS.map((timeSlot, index) => (
            <div
              key={timeSlot}
              className={cn("grid grid-cols-[100px_repeat(6,1fr)] border-b", index % 2 === 0 ? "bg-muted/30" : "")}
            >
              <div className="p-2 text-sm text-center">{formatTime(timeSlot)}</div>

              {DAYS.map((day) => {
                const items = getScheduleForTimeSlot(day, timeSlot, activeSection)
                return (
                  <div key={day} className="p-1 border-l min-h-[50px]">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-primary/10 text-primary p-1 text-xs rounded mb-1 overflow-hidden"
                        title={`${item.subject} - ${item.professor} - ${item.room}`}
                      >
                        <div className="font-medium truncate w-[100px] lg:w-[150px]">{item.subject}</div>
                        <div className="truncate text-[10px]">{item.room}</div>
                        <div className="truncate text-[10px]">{item.professor}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

