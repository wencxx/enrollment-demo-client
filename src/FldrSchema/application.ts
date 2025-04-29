import { z } from 'zod'

export const formSchema = z.object({
  // Resident Status
  residentStatus: z.enum(["Freshman", "Cross-Enrollee", "Returnee", "Transferee"]),
  // program: z.string().min(1, "Program is required"),

  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  birthDate: z.date({
    required_error: "Date of birth is required",
  }),
  address: z.string().min(1, "Address is required"),
  enrollRemarks: z.string().optional(),
  hsCode: z.string().min(1, "Highschool is required"),
  hsYearGraduated: z.string().min(1, "Year graduated is required"),
  elementaryCode: z.string().min(1, "Elementary is required"),
  ElementaryGraduated: z.string().min(1, "Year graduated is required"),
  contactNo: z.string().min(1, "Contact number is required"),
  emailAddress: z.string().min(1, "Email address is required"),
  genderCode: z.string({
    required_error: "Gender is required"
  }).min(1, "Gender is required"),
  tcCode: z.string().min(1, "Town/City is required"),
})