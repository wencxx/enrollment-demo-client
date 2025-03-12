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
    required_error: "Please enter your first name"
  }).min(3),
  middleName: z.string({
    required_error: "Please enter your middle name"
  }).min(2),
  lastName: z.string({
    required_error: "Please enter your last name"
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

export const enrollment1Schema = z.object({
  yearCode: z.string()
    .min(1, { message: "Select a year." }),
  semCode: z.string()
    .min(1, { message: "Select a semester." }),
  courseCode: z.string()
    .min(1, { message: "Select a course." }),
  studentCode: z.string()
   .min(1, { message: "Select a student." }),
  enrollStatusCode: z.string()
    .min(1, { message: "Please confirm status." })
})

export const rateSchema = z.object({
  rateTypeCode: z.string()
    .min(1, { message: "Select a rate type." }),
  rateDesc: z.string()
    .min(1, { message: "Enter a description." }),
  noUnits: z
    .string()
    .min(1, { message: "Enter the number of units." })
    .transform((val) => parseInt(val))
    .refine((val) => Number.isInteger(val), { message: "Number of units must be an integer." })
    .refine((val) => val > 0, { message: "Number of units must be a positive number." }),
  rateAmount: z
    .string()
    .min(1, { message: "Enter the rate amount." })
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: "Rate amount must be a valid number." }),
  pkCode: z.string()
  .min(1, { message: "Select a rate course." })
})

// DIAZ: this is for entryRateCourse
export const entryRateSchema = z.object ({
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