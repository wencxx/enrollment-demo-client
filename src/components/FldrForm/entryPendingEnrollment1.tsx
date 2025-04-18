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
import { EnrollmentStatus } from "@/FldrTypes/enrollmentstatus"
// import { zodResolver } from "@hookform/resolvers/zod"
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
  import { studentCodeProps } from "@/FldrTypes/studentCode"

type Enrollment1FormData = z.infer<typeof enrollmentMergedSchema>

export function PendingApplicantEnrollment1Form({ studentCode, closeModal }: studentCodeProps) {
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
  const [status, setStatus] = useState<EnrollmentStatus[]>([])
  const [academicYear, setAcademicYear] = useState<AcademicYear[]>([])

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

  async function fetchAYears() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListAcademicYear`)
          const mappedAcadYear = response.data.map((item: AcademicYear) => ({
              label: `${item.ayStart} to ${item.ayEnd}`,
              value: item.aYearCode,
          }))
          setAcademicYear(mappedAcadYear)
      } catch (error: any) {
          console.error("Error fetching courses:", error)
      }
      }

  useEffect(() => {
    fetchYears()
    fetchSem()
    fetchCourse()
    fetchStatus()
    fetchAYears()
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
      const postResponse = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertEnrollment1`, enrollment1Data)
      console.log("Response:", postResponse)
      console.log("SENT:", enrollment1Data);
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
        
        
        </div>

        <div className="space-y-4">
        <FormField
          control={form.control}
          name="enrollStatusCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.length > 0 ? (
                    status.map((statusItem) => (
                      <SelectItem key={statusItem.enrollStatusCode} value={statusItem.enrollStatusCode}>
                        {statusItem.enrollStatusDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-status" disabled>Not Available</SelectItem>
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Academic Year</FormLabel>
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
                                ? academicYear.find(
                                    (academicYear) => academicYear.value === field.value
                                  )?.label
                                : "Select academic year"}
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
                                {academicYear.map((academicYear) => (
                                  <CommandItem
                                    value={academicYear.label}
                                    key={academicYear.value}
                                    onSelect={() => {
                                        form.setValue("aYearCode", academicYear.value);
                                        field.onChange(academicYear.value);
                                    }}
                                  >
                                    {academicYear.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        academicYear.value === field.value
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
            </div>
        <div className="w-full space-y-6 col-span-2">
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
            <Button type="submit" className="w-full sm:w-20 float-right">Submit</Button>
          </div>
          </div>
      </form>
    </Form>
  )
}
