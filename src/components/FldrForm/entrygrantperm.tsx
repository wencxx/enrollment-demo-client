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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { grantSchema } from "@/FldrSchema/routes"


// generate typescript type based on zod schema // z.infer used to extract typescript type from schema
type RouteFormData = z.infer<typeof grantSchema>

export function GrantPermForm({ getAllGrantedPerm }: { getAllGrantedPerm: () => void }) {
  // useform initialize a form with router form as its expteded data type
  const form = useForm<RouteFormData>({ 
    // integrates zod validation into the form, when the form is submitted it validates,
    resolver: zodResolver(grantSchema),
    defaultValues: {
      groupCode: "",
      path: ""
    }
  })

  const onSubmit = async (values: RouteFormData) => {
    try {
      const res = await axios.post<any>(`${plsConnect()}/api/Permission`, values)

      if(res.status === 200){
        toast("Granted permission successfully.")
        getAllGrantedPerm()
      }
    } catch (error) {
      toast("Something went wrong.")
    }
  }

  return (
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="groupCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">Admin</SelectItem>
                      <SelectItem value="02">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <Button type="submit" className="float-right">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
