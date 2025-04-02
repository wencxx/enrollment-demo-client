export type GradesCol = {
    enrollStatusCode: string
    enrollStatusDesc: string
}

export type GradeData = {
    pkCode: string
    studentCode: string
    courseCode: string
    subjectCode: string
    subjectDesc: string
    yearCode: string
    yearDesc: string
    semCode: string
    semDesc: string
    noUnits: number
    grade: string
    percentage: number
    remarks: string
}

export type SemesterGradeData = {
    name: string
    gwa: number
    gwaTrend: number
    units: number
    courses: number
    highestGrade: string
    highestCourse: string
    lowestGrade: string
    lowestCourse: string
    courseList: GradeData[]
}

export type AcademicYearData = {
    cumulativeGWA: number
    year: number
    section: string
    semesters: {
        [key: string]: SemesterGradeData
    }
}

export type StudentGradeReport = {
    studentInfo: {
        studentCode: string
        studentId: string
        firstName: string
        middleName: string
        lastName: string
        course: string
    }
    academicData: {
        [key: string]: AcademicYearData
    }
}