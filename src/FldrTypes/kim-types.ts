export type YearCol = {
    yearCode: string
    yearDesc: string
}

export type CourseCol = {
    courseCode: string
    courseDesc: string
}

export type Rate1Col = {
    pkRate1: string
    yearCode: string
    courseCode: string
    yearDesc: string
    courseDesc: string
}

export type RateTypeCol = {
    rateTypeCode: string
    rateTypeDesc: string
}

export type RateDescCol = {
    rdCode: string
    rdID: string
    rdDesc: string
}

export type Rate2Col = {
    pkRate: string
    noUnits: number
    rateAmount: number
    rdCode: string
    rdDesc: string
    rdid: string
    rateTypeCode: string
    rateTypeDesc: string
    pkRate1: string
    yearDesc: string
    courseDesc: string
}

export type StudentCol = {
    studentCode: string
    studentID: string
    firstName: number
    middleName: string
    lastName: string
    suffix: string
    enrollStatusCode: string
    genderCode: string

    address: string
    birthDate: Date
    contactNo: string
    emailAddress: string
    userCode: string
}

export type EnrollDescCol = {
    pkedCode: string
    yearDesc: string
    courseDesc: number
    semDesc: string
    sectionDesc: string
    aYearDesc: string
}

export type Enrollment1Col = {
    pkCode: string
    studentCode: string
    yearDesc: string
    semDesc: string
    courseDesc: string
    sectionDesc: string
    aYearDesc: string
    firstName: string
    middleName: string
    lastName: string
    suffix: string
}

export type EnrollStatusCol = {
    enrollStatusCode: string
    enrollStatusDesc: string
}

export type GroupCol = {
    groupCode: string
    groupName: string
}