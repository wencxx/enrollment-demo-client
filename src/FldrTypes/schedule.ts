export interface ScheduleItem {
  scheduleCode: string
  courseCode: string
  courseDesc: string
  yearCode: string
  yearDesc: string
  section: string
  subjectCode: string
  subjectDesc: string
  day: string
  timeStart: string
  timeEnd: string
  roomCode: string
  roomName: string
  professor: string
}

export type Schedule = ScheduleItem[]

