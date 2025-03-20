export interface ScheduleItem {
    id: string
    course: string
    section: string
    subject: string
    day: string
    startTime: string
    endTime: string
    room: string
    professor: string
  }
  
  export type Schedule = ScheduleItem[]
  
  