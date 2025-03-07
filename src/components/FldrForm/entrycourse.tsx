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
import { courseSchema } from "@/FldrSchema/userSchema.ts"


type CourseFormData = z.infer<typeof courseSchema>

export function CourseForm() {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseDesc: "",
    },
  })

  const onSubmit = async (values: CourseFormData) => {
    const courseData = {
      courseDesc: values.courseDesc,
    }

    try {
      const response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertCourse`, courseData)

      console.log("Data submitted successfully:", response.data)
      toast("Course entered successfully.")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        //console.error("Error submitting form:", error.response?.data || error.message)
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
