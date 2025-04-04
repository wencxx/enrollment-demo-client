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
import { routeSchema } from "@/FldrSchema/routes"


// generate typescript type based on zod schema // z.infer used to extract typescript type from schema
type RouteFormData = z.infer<typeof routeSchema>

export function RoutesForm({ getAllRoutes }: { getAllRoutes: () => void }) {
  // useform initialize a form with router form as its expteded data type
  const form = useForm<RouteFormData>({
    // integrates zod validation into the form, when the form is submitted it validates,
    resolver: zodResolver(routeSchema),
    defaultValues: {
      objectName: "",
      path: ""
    }
  })

  const onSubmit = async (values: RouteFormData) => {
    // console.log(values)
    try {
      const res = await axios.post<any>(`${plsConnect()}/api/Object`, values)

      if (res.status === 200) {
        toast("Route added successfully.")
        getAllRoutes()
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
            name="objectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Route</FormLabel>
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
