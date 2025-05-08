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
import { townSchema } from "@/FldrSchema/userSchema.ts"


type TownFormData = z.infer<typeof townSchema>

export function TownForm({ setOpenForm, getTown }: { setOpenForm: (open: boolean) => void, getTown: () => void }) {
  const form = useForm<TownFormData>({
    resolver: zodResolver(townSchema),
    defaultValues: {
      tcDesc: "",
    },
  })

  const onSubmit = async (values: TownFormData) => {
    try {
      const response = await axios.post(`${plsConnect()}/api/TownCity`, values)

      console.log("Data submitted successfully:", response.data)
      setOpenForm(false)
      getTown()
      toast("Town/City Added successfully.")
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
          name="tcDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Town/City Description</FormLabel>
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
