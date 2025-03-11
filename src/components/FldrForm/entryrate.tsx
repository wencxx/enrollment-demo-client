"use client"
import { rateSchema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { Year } from "@/FldrTypes/year"
import { CourseCol } from "@/FldrTypes/course.col"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Form,
    FormControl,
    //FormDescription,
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
import { RateType } from "@/FldrTypes/rate"
import { Input } from "../ui/input"

type RateFormData = z.infer<typeof rateSchema>

export function RateForm() {
    const form = useForm<RateFormData>({
        resolver: zodResolver(rateSchema),
        defaultValues: {
          yearCode: "",
          courseCode: "",
          rateTypeCode: "",
          noUnits: "",
          rateCode: "",
          rateDesc: "",
          rateAmount: "",
        },
        mode: 'onChange',
      })

    const [years, setYears] = useState<Year[]>([])
    const [course, setCourse] = useState<CourseCol[]>([])
    const [rateType, setRateType] = useState<RateType[]>([])


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
    async function fetchCourse() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
            const mappedCourseCode = response.data.map((item: CourseCol) => ({
                label: item.courseDesc,
                value: item.courseCode,
            }))
            setCourse(mappedCourseCode)
        console.log("Course data: ", response.data)
        } catch (error: any) {
            console.error("Error fetching courses:", error)
        }
        }
        fetchCourse()
  }, [])

  useEffect(() => {
    async function fetchRateType() {
      try {
        const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRateType`) 
        setRateType(response.data) 
        } catch (error: any) {
            console.error("Error fetching rate types:", error)
        }
        }

        fetchRateType()
  }, [])

  const onSubmit = async (values: RateFormData) => {

      const rateData = {
        yearCode: values.yearCode,
        courseCode: values.courseCode,
        rateTypeCode: values.rateTypeCode,
        noUnits: values.noUnits,
        rateDesc: values.rateDesc,
        rateAmount: values.rateAmount,
      }

      try {
        //const response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertRate`, rateData)
  
        toast("Success.")
        console.log("Data:", rateData)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3 grid grid-cols-2 gap-2">

      <FormField
          control={form.control}
          name="rateDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
          control={form.control}
          name="noUnits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Units</FormLabel>
              <FormControl>
                <Input placeholder="No. of units" {...field} />
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
          name="rateTypeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rateType.length > 0 ? (
                    rateType.map((rateType) => (
                      <SelectItem key={rateType.rateTypeCode} value={rateType.rateTypeCode}>
                        {rateType.rateTypeDesc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No rate types available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rateAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Amount</FormLabel>
              <FormControl>
                <Input placeholder="Monetary value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2">
        <Button type="submit" className="w-full sm:w-20">
            Submit
        </Button>
        </div>
      </form>
    </Form>
  )
}
