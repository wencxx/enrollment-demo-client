import { z } from "zod"

export const loginSchema = z.object({
  username: z.string({
    required_error: "Please enter a username",
  }).min(3).max(50),
  password: z.string({
    required_error: "Please enter a password",
  }).min(3).max(16),
})

export const registerSchema = z.object({
  userName: z.string({
    required_error: "Please enter a username"
  }).min(6, "Username must be atleat 6 charactesrs").max(50, "Username must not exceed 50 characters"),
  pWord: z.string({
    required_error: "Please enter a password"
  }).min(8, "Password must be atleast 8 characters").max(50, "Password must not exceed 50 characters").regex(/[0-9]/, "Password must have a number").regex(/^(?=.*[a-z])(?=.*[A-Z]).*$/, 'Password must have upper and lowercase'),
  firstName: z.string({
    required_error: "Please enter users first name"
  }).min(3),
  middleName: z.string({
    required_error: "Please enter users middle name"
  }).min(2),
  lastName: z.string({
    required_error: "Please enter users last name"
  }).min(2),
  groupCode: z.string({
    required_error: "Please enter group name"
  }).min(2)
})

export const studentSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name at least 2 characters.",
  }),
  middleName: z.string().min(2, {
    message: "Middle name at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name at least 2 characters.",
  }),
  birthDate: z.union([z.string(), z.date()]).optional(),
  enrollRemarks: z.string().min(2, {
    message: "Make a remark.",
  }),
  gender: z.string().min(1, {
    message: "Select.",
  }),
  suffix: z.string().min(2, {
    message: "Select.",
  }),
})

export const courseSchema = z.object({
  courseCode: z.string().optional(),
  courseDesc: z.string().min(2, {
    message: "Course description must be at least 2 characters.",
  }),
  collegeCode: z.string().min(1, {
    message: "Select college.",
  }),
})

export const professorSchema = z.object({
  professorCode: z.string().optional(),
  professorName: z.string().nonempty('Professor name is required'),
})

export const highschoolSchema = z.object({
  hsCode: z.string().optional(),
  hsDesc: z.string().nonempty('High school description is required'),
})

export const elementarySchema = z.object({
  elementaryCode: z.string().optional(),
  elementaryDesc: z.string().nonempty('Elementary description is required'),
})

export const townSchema = z.object({
  tcDesc: z.string().nonempty('Town/City description is required'),
})

export const enrollDescriptionSchema = z.object({
  yearCode: z.string().nonempty('Year is required'),
  courseCode: z.string().nonempty('Course is required'),
  semCode: z.string().nonempty('Semester is required'),
  sectionCode: z.string().nonempty('Section is required'),
  ayCode: z.string().nonempty('Academic year is required'),
})

export const enrollment1Schema = z.object({
  pkCode: z.string().optional(),
  voucher: z.string().optional(),
  studentCode: z.string()
    .min(1, { message: "Select a student." }),
  pkedCode: z.string()
    .min(1, { message: "Select an enrollment description." }),
  regularStudent: z.boolean(),
  approveStudent: z.boolean().optional(),
  tDate: z.string().optional(),
})

export const enrollment2Schema = z.object({
  pkCode: z.string().min(1, { message: "Select a student." }),
  pkRate:z.string(),
  rowNum: z.number(),
  subjectCode: z.string().min(1, { message: "Select a subject." }),
  professorCode: z.string().min(1, { message: "Select a professor." }),
  roomCode: z.string().min(1, { message: "Select a room." }),
  scheduleDayCode: z.string().min(1, { message: "Select a day." }),
  classStart: z.string().min(1, { message: "Enter class start time." }),
  classEnd: z.string().min(1, { message: "Enter class end time." }),
  noUnits: z.number().min(0, { message: "Units required." }),
  rateAmount: z.number().min(0, { message: "Rate amount required." }),
  amount: z.number().min(0, { message: "Amount required." }),
  rateTypeCode: z.string().optional(),
});


export const enrollment3Schema = z.object({
  pkCode: z.string().min(1, { message: "Select a student." }),
  credit: z.coerce.number(),
  debit: z.coerce.number(),
  remarks: z.string(),
});

export const enrollmentMergedSchema = z.object({
  yearCode: z.string()
    .min(1, { message: "Select a year." }),
  semCode: z.string()
    .min(1, { message: "Select a semester." }),
  courseCode: z.string()
    .min(1, { message: "Select a course." }),
  studentCode: z.string()
    .min(1, { message: "Select a student." }),
  date: z.date()
    .refine((val) => val <= new Date(), { message: "Date must be today or earlier." }),
  enrollStatusCode: z.string()
    .min(1, { message: "Please confirm status." }),
    aYearCode: z.number().min(1, { message: "Select an academic year." }),
    pkCode: z.string().min(1, { message: "Select a student." }),
    rowNum: z.number(),
    rateCode: z.string().min(1, { message: "Select a rate." }),
    amount: z.number(),
})

export const rateSchema = z.object({
  pkRate1: z.string().min(1),
  rows: z.array(
    z.object({
      // rateRowNum: z.number(),
      noUnits: z.string().min(1),
      rdCode: z.string().min(1),
      rateTypeCode: z.string().min(1),
      perSem: z.string().min(1),
      rateAmount: z.string().min(1),
      rateSubTypeCode: z.string().min(1),
    })
  ),
});

export const editRate2Schema = z.object({
  pkRate1: z.string().min(1, "pkRate1 is required"),
  rdCode: z.string().min(1, "rdCode is required"),
  rateTypeCode: z.string().min(1, "rateTypeCode is required"),
  rateSubTypeCode: z.string().min(1, "rateSubTypeCode is required"),
  perSem: z.coerce.number().nonnegative("perSem must be a number"),
  noUnits: z.coerce.number().nonnegative("noUnits must be a number"),
  rateAmount: z.coerce.number().nonnegative("rateAmount must be a number"),
});


// DIAZ: this is for entryRateCourse
export const entryRateSchema = z.object({
  yearCode: z.string()
    .min(1, { message: "Select a year." }),
  courseCode: z.string()
    .min(1, { message: "Select a course." }),
  semCode: z.string()
    .min(1, { message: "Select a semester." }),
})

export const applicationSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name at least 2 characters.",
  }),
  middleName: z.string().min(2, {
    message: "Middle name at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address invalid.",
  }),
  birthDate: z.union([z.string(), z.date()]).optional(),
})

export const studentEditSchema = z.object ({
  firstName: z.string().min(2, {
    message: "First name at least 2 characters.",
  }),
  middleName: z.string().min(2, {
    message: "Middle name at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name at least 2 characters.",
  }),
  birthDate: z.union([z.string(), z.date()]).optional(),

  // address: z.string().min(2, {
  //   message: "Address invalid.",
  // }),
  semCode: z.string()
    .min(1, { message: "Select a semester." }),
    yearCode: z.string()
    .min(1, { message: "Select a year." }),
  courseCode: z.string()
    .min(1, { message: "Select a course." }),
  studentCode: z.string()
   .min(1, { message: "Select a student." }),
})
export const voidSchema = z.object({
  void: z.boolean(),
});

export const editRateSchema = z.object({
  subjectCode: z.string().min(1, 'Subject code is required'),
  noUnits: z.number().min(1, 'Number of units must be at least 1'),
  rateAmount: z.number().min(0, 'Rate amount must be greater than 0'),
  rateTypeCode: z.string().min(1, 'Rate type is required'),
});

export const subjectSchema = z.object({
  rdCode: z.string().optional(),
  rdid: z.string().min(1, 'Subject ID is required'),
  rdDesc: z.string().min(1, 'Subject description is required'),
});

export const prerequisiteSchema = z.object({
  RDID: z.string().min(1, 'Subject code is required'),
  PrerequisiteCode: z.string().min(1, 'Subject prerequisite is required'),
});

export const acadYearSchema = z.object({
  ayStart: z.number()
    .min(2000, { message: "Year must be 2000 or later." })
    .max(4000, { message: "Year must be 4000 or earlier." }),
  ayEnd: z.number()
    .min(2000, { message: "Year must be 2000 or later." })
    .max(4000, { message: "Year must be 4000 or earlier." }),
}).refine((data) => data.ayEnd > data.ayStart, {
  message: "Ending year cannot be the same or before the starting year.",
  path: ["ayEnd"],
});

export const gradeEditSchema = z.object({
  // subjectCode: z.string().min(1, 'Subject code is required'),
});

export const gradeGenSchema = z.object({
  pkCode: z.string().min(1),
  userCode: z.string().min(1)
});

export const roomSchema = z.object({
  roomCode: z.string().optional(),
  roomDesc: z.string().min(2, {
    message: "Room description must be at least 2 characters.",
  }),
})

export const sectionSchema = z.object({
  sectionCode: z.string().optional(),
  sectionDesc: z.string().min(2, {
    message: "Section description must be at least 2 characters.",
  }),
})

export const rateDescSchema = z.object({
  rdCode: z.string().optional(),
  rdid: z.string().min(2, {
    message: "ID cannot be empty.",
  }),
  rdDesc: z.string().min(2, {
    message: "Description cannot be empty",
  })
})

export const rate2Schema = z.object({
  pkRate: z.string().optional(),
  pkRate1: z.string().min(1),
  rdCode: z.string().min(1),
  rateTypeCode: z.string().min(1),
  noUnits: z.number().int().min(0, 'Number of units cannot be negative'),
  rateAmount: z.number().min(0, 'Rate amount must be greater than 0'),
})

export const userGroupDataSchema = z.object({
  groupCode: z.string().optional(),
  groupName: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
})

export const collegeSchema = z.object({
  collegeCode: z.string().optional(),
  collegeDesc: z.string().min(2, {
    message: "College must be at least 2 characters.",
  }),
})

export const semesterSchema = z.object({
  semDesc: z.string().min(5),
});