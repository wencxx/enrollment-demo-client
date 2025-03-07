"use client"
import { enrollment1Schema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { Year } from "@/FldrTypes/year"
import { Sem } from "@/FldrTypes/sem"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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

export function Enrollment1Form() {
    const form = useForm<Enrollment1FormData>({
        resolver: zodResolver(enrollment1Schema),
        defaultValues: {
          yearCode: "",
          semCode: "",
        },
        mode: 'onChange',
      })

    const [years, setYears] = useState<Year[]>([])
    const [sem, setSem] = useState<Sem[]>([])

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

  const onSubmit = async (values: Enrollment1FormData) => {
      const enrollment1Data = {
        yearCode: values.yearCode,
        semCode: values.semCode,
      }
  
      try {
        //const response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertCourse`, enrollment1Data)
  
        console.log("Data submitted successfully:", enrollment1Data)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="yearCode"  // Make sure it's the correct name from your schema
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Year" />
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
          name="semCode"  // Make sure it's the correct name from your schema
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
