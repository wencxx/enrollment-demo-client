import { z } from 'zod'

export const formSchema = z.object({
  // Resident Status
  residentStatus: z.enum(["Cross-Enrollee", "Freshmen", "Returnee", "Transferee"]),
  program: z.string().min(1, "Program is required"),
  yearLevel: z.string().min(1, "Year level is required"),
  lrn: z.string().optional(),

  // Personal Information
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  citizenship: z.string().min(1, "Citizenship is required"),
  religion: z.string().min(1, "Religion is required"),
  civilStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

  // Address
  country: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
  street: z.string().min(1, "Street is required"),

  // Contact
  homeTelephone: z.string().optional(),
  mobileNumber: z.string().min(1, "Mobile number is required"),

  // Program Details
  firstChoiceProgram: z.string().min(1, "First choice program is required"),
  secondChoiceProgram: z.string().optional(),
  programInfluence: z.enum(["Parent", "Personal", "Benefactor", "Friend", "Others"]),
  programInfluenceOther: z.string().optional(),
  educationSupport: z.enum(["Parent", "Scholarship", "Employed", "Relative", "Benefactor"]),
  typeOfScholarship: z.string().optional(),

  // Parents
  motherAlive: z.boolean().default(true),
  motherAlumnus: z.boolean().default(false),
  motherName: z.string().optional(),
  motherAddress: z.string().optional(),
  motherContact: z.string().optional(),
  motherEmail: z.string().optional(),
  motherEducation: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherCompanyName: z.string().optional(),
  motherCompanyAddress: z.string().optional(),
  motherCompanyTelephone: z.string().optional(),
  motherSalary: z.string().optional(),

  fatherAlive: z.boolean().default(true),
  fatherAlumnus: z.boolean().default(false),
  fatherName: z.string().optional(),
  fatherAddress: z.string().optional(),
  fatherContact: z.string().optional(),
  fatherEmail: z.string().optional(),
  fatherEducation: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherCompanyName: z.string().optional(),
  fatherCompanyAddress: z.string().optional(),
  fatherCompanyTelephone: z.string().optional(),
  fatherSalary: z.string().optional(),

  // Family Details
  livingWith: z.enum(["Parents", "Mother", "Father", "Guardian", "Alone", "Others"]),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianContact: z.string().optional(),
  numberOfSiblings: z.string().optional(),
  numberOfBrothers: z.string().optional(),
  numberOfSisters: z.string().optional(),

  // Education
  elementarySchoolName: z.string().optional(),
  elementaryYearGraduated: z.string().optional(),
  elementaryHonors: z.string().optional(),

  highSchoolName: z.string().optional(),
  highSchoolYearGraduated: z.string().optional(),
  highSchoolHonors: z.string().optional(),

  collegeName: z.string().optional(),
  collegeYearGraduated: z.string().optional(),
  collegeHonors: z.string().optional(),

  schoolLastAttended: z.string().min(1, "School last attended is required"),
  previousSchoolAverage: z.string().optional(),
  inclusionDate: z.string().optional(),
  section: z.string().optional(),

  // Additional Info
  specialSkills: z.string().optional(),
  handicapAilment: z.string().optional(),
})