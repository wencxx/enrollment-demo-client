export type YearCol = {
    yearCode: string
    yearDesc: string
}

export type CourseCol = {
    courseDesc: string
    courseCode: string
    collegeCode: string
    collegeDesc: string
    value?: string
    label?: string
}

export type SemCol = {
    semCode: string
    semDesc: string
}

export type Rate1Col = {
    pkRate1: string
    yearCode: string
    courseCode: string
    yearDesc: string
    courseDesc: string
    semCode: string
    semDesc: string
    label: string
    value: string
}

export type RateTypeCol = {
    rateTypeCode: string
    rateTypeDesc: string
    label: string
    value: string
}

export type RateSubTypeCol = {
    rateSubTypeCode: string
    rateSubTypeDesc: string
    label: string
    value: string
}

export type RateDescCol = {
    rdCode: string
    rdID: string
    rdDesc: string
    label: string
    value: string
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
    firstName: string
    middleName: string
    lastName: string
    suffix: string
    enrollStatusCode: string
    genderCode: string

    address: string
    birthDate: string
    contactNo: string
    emailAddress: string
    userCode: string
}

export type EnrollDescCol = {
    pkedCode: string
    yearDesc: string
    courseDesc: string
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
    tDate: string
    regularStudent: boolean
    approveStudent: boolean
}

export type EnrollStatusCol = {
    enrollStatusCode: string
    enrollStatusDesc: string
}

export type GroupCol = {
    groupCode: string
    groupName: string
}

export type AYCol = {
    aYearCode: string
    aYearDesc: string
}

export type CollegeCol = {
    collegeCode: string;
    collegeDesc: string;
    label: string;
    value: string;
}

export type AcademicYear = {
    aYearCode: number;
    ayStart: number;
    ayEnd: number;
}

// export type AcademicYearData = {
//     cumulativeGWA: number
//     year: number
//     section: string
//     semesters: {
//         [key: string]: SemesterGradeData
//     }
// }

export interface DialogState {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  pkRate: string;
  setPKRate: (pk: string) => void;
  handleDialogOpen: (pk: string) => void;
  handleUpdate: () => void;
}

export type Semester = {
    semDesc: string;
}