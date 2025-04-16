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
import { highschoolSchema } from "@/FldrSchema/userSchema.ts"


type HighschoolFormData = z.infer<typeof highschoolSchema>

export function HighschoolForm({ setOpenForm, getHighschool }: { setOpenForm: (open: boolean) => void, getHighschool: () => void }) {
  const form = useForm<HighschoolFormData>({
    resolver: zodResolver(highschoolSchema),
    defaultValues: {
      hsDesc: "",
    },
  })

  const onSubmit = async (values: HighschoolFormData) => {
    try {
      const response = await axios.post(`${plsConnect()}/api/Highschool`, values)

      console.log("Data submitted successfully:", response.data)
      setOpenForm(false)
      getHighschool()
      toast("Highschool Added successfully.")
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
          name="hsDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>High School Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="float-right">Submit</Button>
      </form>
    </Form>
    </>
  )
}
