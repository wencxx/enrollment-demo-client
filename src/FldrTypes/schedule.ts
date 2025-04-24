export interface ScheduleItem {
  pkedCode: string
  scheduleCode: string
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

