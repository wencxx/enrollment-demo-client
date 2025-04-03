import { z } from "zod"
import { enrollmentMergedSchema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { AcademicYear } from "@/FldrTypes/academic-year"
import { Year } from "@/FldrTypes/year"
import { Sem } from "@/FldrTypes/sem"
import { CourseCol } from "@/FldrTypes/course.col"
import { RateCol } from "../FldrDatatable/rate-columns"
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
import { studentCodeProps } from "@/FldrTypes/studentCode"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
  import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

type Enrollment1FormData = z.infer<typeof enrollmentMergedSchema>

export function NewSemEnrollment1Form({ studentCode, closeModal }: studentCodeProps) {
  const form = useForm<Enrollment1FormData>({
    defaultValues: {
      yearCode: "",
      semCode: "",
      courseCode: "",
      studentCode,
      date: new Date(),
      enrollStatusCode: "",
      aYearCode: 0,
      rateCode: "",
      amount: 0,
    },
    mode: 'onChange',
  })

  const [years, setYears] = useState<Year[]>([])
  const [sem, setSem] = useState<Sem[]>([])
  const [course, setCourse] = useState<CourseCol[]>([])
  const [academicYear, setAcademicYear] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
        if (!studentCode) return;
  
        const fetchStudent = async () => {
          try {
            // fetches by highest/latest pkCode
            const response = await axios.get(
              `${plsConnect()}/API/WEBAPI/ListController/ListStudentEnrollment1?studentCode=${studentCode}`
            );
            form.reset({
              studentCode: response.data.studentCode,
              firstName: response.data.firstName || "",
              middleName: response.data.middleName || "",
              lastName: response.data.lastName || "",
              courseCode: response.data.courseCode || "",
              courseDesc: response.data.courseDesc || "",
              yearCode: response.data.yearCode || "",
              yearDesc: response.data.yearDesc || "",
              semCode: response.data.semCode || "",
              semDesc: response.data.semDesc || "",

              aYearCode: response.data.aYearCode || "",
              ayStart: response.data.ayStart || "",
              ayEnd: response.data.ayEnd || "",
            });
            setLoading(false);
          } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch student details.");
            setLoading(false);
          }
        };

        fetchStudent();
      }, [studentCode]);
  
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

  async function fetchCourse() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
      setCourse(response.data)
    } catch (error: any) {
      console.error("Error fetching courses:", error)
    }
  }

  async function fetchAYears() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListAcademicYear`)
      setAcademicYear(response.data)
    } catch (error: any) {
      console.error("Error fetching courses:", error)
    }
  }

  useEffect(() => {
    fetchYears()
    fetchSem()
    fetchCourse()
    fetchAYears()
    console.log("Year: ", academicYear)
  }, [])

  const [rates, setRate] = useState<RateCol[]>([]);
  
    const fetchRate = async () => {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListDistinctRate`);
        const mappedRate = response.data.map((item: RateCol) => ({
          label: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc}`,
          value: item.rateCode,
        }))
        setRate(mappedRate)
      } catch (error: any) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      fetchRate();
    }, [])
  
  const [amount, setAmount] = useState<number>(0);
  const [rateCode, setRateCode] = useState<string>('');
  
    useEffect(() => {
        const fetchRateAmountSum = async () => {
            try {
                if (rateCode) {
                    console.log("Rate Code:", rateCode)
                    const response = await axios.get(`${plsConnect()}/api/Enrollment2/SumRateAmount/${rateCode}`);
                    
                    setAmount(response.data);
                    form.setValue("amount", response.data);
                }
            } catch (error) {
                console.error("Error fetching sum of RateAmounts:", error);
            }
        };
        fetchRateAmountSum();
    }, [rateCode]);

  const { currentUser } = useAuthStore.getState();

  if (!currentUser) {
    toast("User not logged in.");
    return;
  }

  const onSubmit = async (values: Enrollment1FormData) => {
    const currentDate = new Date();

    const enrollment1Data = {
      ...values,
      userCode: currentUser.userCode,
      tDate: currentDate,
      dateEncoded: currentDate,
      rateCode: values.rateCode,
      amount: values.amount,
    }

    try {
      const postResponse = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertNewEnrollment1`, enrollment1Data)
      console.log("Data submitted successfully:", postResponse);
      console.log("Submitted:", enrollment1Data);
      closeModal()
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

  if (loading) return <p>Fetching details...</p>;

  // MAKE EVERYTHIGN NOT EDITABLE
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="w-full space-y-6 grid grid-cols-2 gap-2 mt-4">
    <div className="space-y-4">
      <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Code</FormLabel>
              <FormControl>
                <input
                  {...field}
                  disabled
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </FormControl>
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
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.length > 0 ? (
                    years.map((yearItem) => (
                      <SelectItem key={yearItem.yearCode} value={yearItem.yearCode}>
                        {yearItem.yearDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-status" disabled>No years available</SelectItem>
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
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {course.length > 0 ? (
                    course.map((courseItem) => (
                      <SelectItem key={courseItem.courseCode} value={courseItem.courseCode}>
                        {courseItem.courseDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-status" disabled>No courses available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  value={`${form.getValues("firstName") || ""} ${form.getValues("middleName") || ""} ${form.getValues("lastName") || ""}`.trim()} // Concatenate and trim
                  disabled
                  className="w-full px-3 py-2 border rounded text-sm"
                />
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
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sem.length > 0 ? (
                    sem.map((semItem) => (
                      <SelectItem key={semItem.semCode} value={semItem.semCode}>
                        {semItem.semDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-status" disabled>No semesters available</SelectItem>
                  )}
                </SelectContent>
              </Select>
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
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {academicYear.length > 0 ? (
                    academicYear.map((ayItem) => (
                      <SelectItem key={ayItem.aYearCode} value={ayItem.aYearCode}>
                        {ayItem.ayStart} - {ayItem.ayEnd}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-status" disabled>No courses available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
        <div className="w-full space-y-6 ">
          <FormField
            control={form.control}
            name="rateCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Rate</FormLabel>
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
                          ? rates.find(
                              (rates) => rates.value === field.value
                            )?.label
                          : "Select rate"}
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
                          {rates.map((rates) => (
                            <CommandItem
                              value={rates.label}
                              key={rates.value}
                              onSelect={() => {
                                  form.setValue("rateCode", rates.value);
                                  field.onChange(rates.value);
                                  setRateCode(rates.value);
                              }}
                            >
                              {rates.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  rates.value === field.value
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

          <FormField name="amount" control={form.control} render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="mr-2">Amount</FormLabel>
              <FormControl>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP',
                  }).format(amount)}
                </span>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="col-span-2">
          <Button type="submit" className="w-full sm:w-20 float-right">Enroll</Button>
        </div>
      </form>
    </Form>
  )
}
