import { z } from "zod"
import { enrollment1Schema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { AcademicYear } from "@/FldrTypes/academic-year"
import { Year } from "@/FldrTypes/year"
import { Sem } from "@/FldrTypes/sem"
import { CourseCol } from "@/FldrTypes/course.col"
import { StudentCol } from "@/FldrTypes/students-col"
import { EnrollmentStatus } from "@/FldrTypes/enrollmentstatus"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import useAuthStore from "@/FldrStore/auth"
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Enrollment1FormData = z.infer<typeof enrollment1Schema>

export function Enrollment1Form() {
  const form = useForm<Enrollment1FormData>({
    resolver: zodResolver(enrollment1Schema),
    defaultValues: {
      yearCode: "",
      semCode: "",
      courseCode: "",
      studentCode: "",
      date: new Date(),
      enrollStatusCode: "",
    },
    mode: 'onChange',
  })

  const [years, setYears] = useState<Year[]>([])
  const [sem, setSem] = useState<Sem[]>([])
  const [course, setCourse] = useState<CourseCol[]>([])
  const [student, setStudent] = useState<StudentCol[]>([])
  const [status, setStatus] = useState<EnrollmentStatus[]>([])
  const [academicYear, setAcademicYear] = useState<AcademicYear[]>([])

  const [studentSearch, setStudentSearch] = useState("");

  const handleStudentSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentSearch(event.target.value);
  };

  const filteredStudents = student.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.middleName.toLowerCase().includes(studentSearch.toLowerCase())
    );
  });

  async function fetchYears() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListYear`)
      setYears(response.data)
    } catch (error: any) {
      console.error("Error fetching years:", error)
    }
  }

  async function fetchSem() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListSemester`)
      setSem(response.data)
    } catch (error: any) {
      console.error("Error fetching semseters:", error)
    }
  }

  async function fetchStatus() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollStatus`)
      setStatus(response.data)
    } catch (error: any) {
      console.error("Error fetching courses:", error)
    }
  }

  async function fetchCourse() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
      const mappedCourseCode = response.data.map((item: CourseCol) => ({
        label: item.courseDesc,
        value: item.courseCode,
      }))
      setCourse(mappedCourseCode)
    } catch (error: any) {
      console.error("Error fetching courses:", error)
    }
  }

  async function fetchStudent() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`)
      //console.log("Fetched students:", response.data);
      setStudent(response.data)
    } catch (error: any) {
      console.error("Error fetching students:", error)
    }
  }

  async function fetchAYears() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListAcademicYear`)
      setAcademicYear(response.data)
    } catch (error: any) {
      console.error("Error fetching years:", error)
    }
  }

  useEffect(() => {
    fetchYears()
    fetchSem()
    fetchCourse()
    fetchStudent()
    fetchStatus()
    fetchAYears()
  }, [])

  const { currentUser } = useAuthStore.getState();

  if (!currentUser) {
    toast("User not logged in.");
    return;
  }

  const onSubmit = async (values: Enrollment1FormData) => {
    console.log("Form values before submit:", values);
    const currentDate = new Date();

    const enrollment1Data = {
      ...values,
      userCode: currentUser.userCode,
      tDate: currentDate,
      dateEncoded: currentDate,
    }

    try {
      const postResponse = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertEnrollment1`, enrollment1Data)

      const putResponse = await axios.put(`${plsConnect()}/API/WEBAPI/StudentController/UpdateStudentEnrollmentStatus`, enrollment1Data)

      console.log("Data submitted successfully:", postResponse)
      console.log("Data submitted successfully:", putResponse)
      toast("Success.")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Error submitting form.")
      } else {
        console.error("Network error:", error)
        toast("Network error.")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 grid grid-cols-2 gap-2">

        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pending applicant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="p-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="Search for a student"
                      value={studentSearch}
                      onChange={handleStudentSearchChange}
                    />
                  </div>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <SelectItem key={student.studentCode} value={student.studentCode}>
                        {student.firstName} {student.lastName}, {student.middleName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No students available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enrollStatusCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="APPROVE or DISAPPROVE" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.length > 0 ? (
                    status.map((status) => (
                      <SelectItem key={status.enrollStatusCode} value={status.enrollStatusCode}>
                        {status.enrollStatusDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>Not Available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.length > 0 ? (
                    years.map((year) => (
                      <SelectItem key={year.yearCode} value={year.yearCode}>
                        {year.yearDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No years available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="semCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sem.length > 0 ? (
                    sem.map((sem) => (
                      <SelectItem key={sem.semCode} value={sem.semCode}>
                        {sem.semDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No semesters available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Course</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? course.find(
                          (course) => course.value === field.value
                        )?.label
                        : "Select course"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>None found.</CommandEmpty>
                      <CommandGroup>
                        {course.map((course) => (
                          <CommandItem
                            value={course.label}
                            key={course.value}
                            onSelect={() => {
                              form.setValue("courseCode", course.value);
                              field.onChange(course.value);
                            }}
                          >
                            {course.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                course.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aYearCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {academicYear.length > 0 ? (
                    academicYear.map((AY) => (
                      <SelectItem key={AY.AYearCode} value={AY.AYearCode}>
                        {AY.AYStart}-{AY.AYEnd}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No years available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* no voucher na */}
        <div className="col-span-2">
          <Button type="submit" className="w-full sm:w-20 float-right">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
