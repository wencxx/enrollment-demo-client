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