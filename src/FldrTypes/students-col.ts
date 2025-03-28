export type StudentColFullName = {
    studentCode: string
    studentID: string
    fullName: string
    birthDate: Date
    Address: string
    enrollStatusCode: number
    enrollRemarks: string
}

export type StudentCol = {
    studentCode: string
    studentID: string
    firstName: string
    lastName: string
    middleName: string
    birthDate: Date
    Address: string
    enrollStatusCode: number
    enrollRemarks: string
    pkCode: string
}

export type StudentDetails = {
    studentCode: string
    studentID: string
    firstName: string
    lastName: string
    middleName: string
    birthDate: Date
    Address: string
    enrollStatusCode: number
    enrollRemarks: string
    pkCode: string
    yearDesc: string
    semDesc: string
    courseDesc: string
}