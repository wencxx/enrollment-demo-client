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
  }).min(2)
  // groupCode: z.string({
  //   required_error: "Please enter group name"
  // }).min(2)
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
  courseDesc: z.string().min(2, {
    message: "Course description must be at least 2 characters.",
  }),
})

export const enrollment1Schema = z.object({
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
})

export const enrollment2Schema = z.object({
  pkCode: z.string().min(1, { message: "Select a student." }),
  rowNum: z.number(),
  rateCode: z.string().min(1, { message: "Select a rate." }),
  amount: z.number(),
});

export const rateSchema = z.object({
  pkCode: z.string().min(1),
  rows: z.array(
    z.object({
      rowNum: z.number(),
      subjectCode: z.string().min(1),
      rateTypeCode: z.string().min(1),
      rateAmount: z.string().min(1),
      noUnits: z.string().min(1),
    })
  ),
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

  address: z.string().min(2, {
    message: "Address invalid.",
  }),
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
  subjectCode: z.string().min(1, 'Subject code is required'),
  subjectDesc: z.string().min(1, 'Subject description is required'),
});

export const prerequisiteSchema = z.object({
  subjectCode: z.string().min(1, 'Subject code is required'),
  prerequisiteCode: z.string().min(1, 'Subject prerequisite is required'),
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