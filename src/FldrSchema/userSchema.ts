import { z } from "zod"

export const loginSchema = z.object({
    username: z.string({
        required_error: "Please select a enter a password",
    }).min(3).max(50),
    password: z.string({
        required_error: "Please select a enter a password",
    }).min(3).max(16),
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
    address: z.string().min(2, {
      message: "Address invalid.",
    }),
    birthDate: z.union([z.string(), z.date()]).optional(),
    enrollRemarks: z.string().min(2, {
      message: "Make a remark.",
    }),
  })

  export const courseSchema = z.object({
    courseDesc: z.string().min(2, {
      message: "Course description must be at least 2 characters.",
    }),
  })
