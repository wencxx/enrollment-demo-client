import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { entryRateSchema } from "@/FldrSchema/userSchema.ts"
import { EntryRateCourse } from "@/FldrTypes/ratecourse-col"


type RateCourseFormData = z.infer<typeof entryRateSchema>

export function RateCourseForm() {
  const form = useForm<RateCourseFormData>({
    resolver: zodResolver(entryRateSchema),
    defaultValues: {
      yearCode: "",
      courseCode: "",
      semCode: "",
    },
  })

  const onSubmit = async (values: RateCourseFormData) => {
    const rateCourseData = {
      yearCode: values.yearCode,
      courseCode: values.courseCode,
      semCode: values.semCode,
    }
    
    try {
        const response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertEntryRateCourse`, values)
  
        console.log("Data submitted successfully:", response.data)
        toast("New student registered successfully.")
  
        const newRateCourse: EntryRateCourse = {
            pkCode: response.data.pkCode,
          yearCode: response.data.yearCode,
          courseCode: response.data.courseCode,
          semCode: response.data.semCode,
        }
  
        onSubmit(newRateCourse)
  
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
    <>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="courseDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </>
  )
}