export type ProfessorCol = {
    professorCode: string
    professorName: string
}

export type AssignedCol = {
    enrollDescription: {
        yearDesc: string,
        semDesc: string,
        courseDesc: string,
        sectionDesc: string,
        ayStart: number,
        ayEnd: number
    },
    professorName: string,
    rdid: string,
    rdDesc: string
}
