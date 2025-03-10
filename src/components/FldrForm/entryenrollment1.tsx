"use client"
import { enrollment1Schema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
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

type Enrollment1FormData = z.infer<typeof enrollment1Schema>

export function Enrollment1Form() {
    const form = useForm<Enrollment1FormData>({
        resolver: zodResolver(enrollment1Schema),
        defaultValues: {
          yearCode: "",
          semCode: "",
          courseCode: "",
          studentID: "",
          voucher: "",
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

    const [studentSearch, setStudentSearch] = useState("");
    const [courseSearch, setCourseSearch] = useState("");

    const handleStudentSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStudentSearch(event.target.value); // Update search query
    };

  const filteredStudents = student.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.middleName.toLowerCase().includes(studentSearch.toLowerCase())
    );
  });

  const handleCourseSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseSearch(event.target.value); // Update search query
  };

const filteredCourses = course.filter((course) => {
  return (
    course.courseDesc.toLowerCase().includes(courseSearch.toLowerCase())
  );
});

  useEffect(() => {
    async function fetchYears() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListYear`) 
        setYears(response.data) 
        } catch (error: any) {
            console.error("Error fetching years:", error)
        }
        }

    fetchYears()
  }, [])

  useEffect(() => {
    async function fetchSem() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListSemester`) 
        setSem(response.data) 
        } catch (error: any) {
            console.error("Error fetching semseters:", error)
        }
        }

    fetchSem()
  }, [])

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`) 
        setCourse(response.data) 
        } catch (error: any) {
            console.error("Error fetching courses:", error)
        }
        }

    fetchCourse()
  }, [])

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`) 
        //console.log("Fetched students:", response.data);
        setStudent(response.data) 
        } catch (error: any) {
            console.error("Error fetching students:", error)
        }
        }

    fetchStudent()
  }, [])

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollStatus`) 
        setStatus(response.data) 
        } catch (error: any) {
            console.error("Error fetching courses:", error)
        }
        }

      fetchStatus()
  }, [])

  const { currentUser } = useAuthStore.getState();

    if (!currentUser) {
      toast("User not logged in.");
      return;
    }

  const onSubmit = async (values: Enrollment1FormData) => {
      const currentDate = new Date();

      const enrollment1Data = {
        yearCode: values.yearCode,
        semCode: values.semCode,
        courseCode: values.courseCode,
        //since StudentCode and StudentID are identical for now, StudentID is put into StudentCode. god bless us all
        studentCode: values.studentID,
        userCode: currentUser.userCode,
        voucher: values.voucher,
        tDate: currentDate,
        dateEncoded: currentDate,
        enrollStatusCode: values.enrollStatusCode,
      }
  
      try {
        const postResponse = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertEnrollment1`, enrollment1Data)

        const putResponse = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateStudentEnrollmentStatus`, enrollment1Data)
  
        console.log("Insert:", postResponse)
        console.log("Update:", putResponse)
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
          name="studentID"
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
                        <SelectItem key={student.studentID} value={student.studentID}>
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
            <FormItem>
              <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="top-full max-h-40 overflow-y-auto max-w-full">
                    <div className="p-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-sm"
                        placeholder="Search for a course"
                        value={courseSearch}
                        onChange={handleCourseSearchChange}
                      />
                    </div>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <SelectItem key={course.courseCode} value={course.courseCode}>
                          {course.courseDesc}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No courses available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* placeholder */}
        <FormField
          control={form.control}
          name="voucher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voucher</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a voucher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AA">AA placeholder</SelectItem>
                  <SelectItem value="BB">BB placeholder</SelectItem>
                  <SelectItem value="CC">CC placeholder</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-20">Submit</Button>
      </form>
    </Form>
  )
}
