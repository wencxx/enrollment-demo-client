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
import { professorSchema } from "@/FldrSchema/userSchema.ts"


type ProfessorFormData = z.infer<typeof professorSchema>

export function ProfessorForm({ setOpenForm, getProfessor }: { setOpenForm: (open: boolean) => void, getProfessor: () => void }) {
  const form = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      professorName: "",
    },
  })

  const onSubmit = async (values: ProfessorFormData) => {
    try {
      const response = await axios.post(`${plsConnect()}/api/Professors`, values)

      console.log("Data submitted successfully:", response.data)
      setOpenForm(false)
      getProfessor()
      toast("Professor Added successfully.")
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
          name="professorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor Name</FormLabel>
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
