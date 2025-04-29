import { StringifyOptions } from "querystring"

export type Enrollment2Col = {
    PKCode: string
    RowNum: string
    RDCode: string
    // PKRate: string
    Amount: string
    ProfessorCode: string
    RoomCode: string
    ScheduleDayCode: string
    ClassStart: string
    ClassEnd: string
    NoUnits: string
}

export type Enrollment2Details = {
    
    FirstName: string
    MiddleName: string 
    LastName: string
    RdDesc: string
    NoUnits: string
    Amount: String
    ProfessorName: string
    ScheduleDayDesc: string
    RoomDesc: string
    CourseDesc: string
    SectionDesc: string
    SemDesc: string
}