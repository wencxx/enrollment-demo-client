import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { enrollDescriptionSchema } from "@/FldrSchema/userSchema.ts";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DescriptionFormData = z.infer<typeof enrollDescriptionSchema>;

interface year {
  yearCode: string
  yearDesc: string
}
interface year {
  yearCode: string
  yearDesc: string
}

interface course {
  courseCode: string
  courseDesc: string
}

interface semester {
  semCode: string
  semDesc: string
}
interface academic {
  aYearCode: string
  aYearDesc: string
}
interface section {
  sectionCode: string
  sectionDesc: string
}


export function EnrollDesciprtionForm() {

  const [years, setYears] = useState<year[]>([])
  const [course, setCourse] = useState<course[]>([])
  const [semesters, setSemesters] = useState<semester[]>([])
  const [academicYears, setAcademicYears] = useState<academic[]>([
    {
      aYearCode: "001",
      aYearDesc: "2025-2026",
    }
  ])
  const [sections, setSections] = useState<section[]>([])

  const getYears = async () => {
    const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListYear`)

    if (res.status === 200) {
      setYears(res.data)
    }
  }

  const getCourse = async () => {
    const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListCourse`)

    if (res.status === 200) {
      setCourse(res.data)
    }
  }

  const getSem = async () => {
    const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListSemester`)

    if (res.status === 200) {
      setSemesters(res.data)
    }
  }

  // const getAY = async () => {
  //     const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListAcademicYear`)

  //     if(res.status === 200) {
  //         setAcademicYears(res.data)
  //     }
  // }

  const getSection = async () => {
    const res = await axios(`${plsConnect()}/API/WebAPI/ListController/ListSection`)

    if (res.status === 200) {
      setSections(res.data)
    }
  }

  useEffect(() => {
    getYears()
    getCourse()
    getSem()
    // getAY()
    getSection()
  }, [])


  const form = useForm<DescriptionFormData>({
    resolver: zodResolver(enrollDescriptionSchema),
    defaultValues: {
      yearCode: "",
      courseCode: "",
      semCode: "",
      sectionCode: "",
      aYearCode: "",
    },
  });


  // add new enrollment description
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: DescriptionFormData) => {
    try {
      setLoading(true)
      const res = await axios.post(`${plsConnect()}/api/EnrollDescription`, values)

      if(res.status === 200){
        toast.success("Enrollment description added successfully")
        form.reset()
      }
    } catch (error) {
      console.log(error)
      toast.error("Error adding enrollment description")
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add new enroll description</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="yearCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Year</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.length && years.map((year, index) => (
                        <SelectItem key={index} value={year.yearCode}>
                          {year.yearDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Course</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {course.length && course.map((course, index) => (
                        <SelectItem key={index} value={course.courseCode}>
                          {course.courseDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Semester</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.length && semesters.map((sem, index) => (
                        <SelectItem key={index} value={sem.semCode}>
                          {sem.semDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sectionCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Section</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.length && sections.map((sec, index) => (
                        <SelectItem key={index} value={sec.sectionCode}>
                          {sec.sectionDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aYearCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Academic Year</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.length && academicYears.map((ay, index) => (
                        <SelectItem key={index} value={ay.aYearCode}>
                          {ay.aYearDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end col-span-2">
            <Button type="submit" disabled={loading} className={`${loading && 'animate-pulse'}`}>
              {loading ? 'adding' : 'Add'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
