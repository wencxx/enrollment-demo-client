export interface Enrollment3Type {
  pkCode: string,
  firstName: string,
  lastName: string,
  middleName: string,
  rdDesc: string,
  noUnits: number,
  classStart: string,
  classEnd: string,
  rateAmount: number,
  professorName: string,
  scheduleDayDesc: string,
  roomDesc: string,
  courseDesc: string,
  sectionDesc: string,
  semDesc: string,
  rowNum: number,
  amount: number
}

type BaseEnrollment = {
  pkCode: string;
  remarks: string;
  debit: number;
  credit: number;
};

export type Enrollment3FormData = BaseEnrollment;

export type Enrollment3Type2 = BaseEnrollment & { refer?: string };