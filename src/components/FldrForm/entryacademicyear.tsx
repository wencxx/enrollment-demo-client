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
import { acadYearSchema } from "@/FldrSchema/userSchema.ts"
import { AcademicYear } from "@/FldrTypes/types";

type AcadYearFormData = z.infer<typeof acadYearSchema>

interface AcadYearFormProps {
  onSuccess?: () => void;
  acadYear: AcademicYear[]
}

export function AcadYearForm({ onSuccess, acadYear }: AcadYearFormProps) {
  const form = useForm<AcadYearFormData>({
    resolver: zodResolver(acadYearSchema),
    defaultValues: {
      ayStart: undefined,
      ayEnd: undefined,
    },
  })

  const onSubmit = async (values: AcadYearFormData) => {
    const alreadyExisting = acadYear.find((ay) => ay.ayStart === values.ayStart && ay.ayEnd === values.ayEnd)


    if(alreadyExisting) return toast.warning('Academic year already exist.')

    const data = {
      ayCode: '12345',
      ...values
    }

    try {
      const response = await axios.post(`${plsConnect()}/api/AcademicYear`, data)
      console.log("Data submitted successfully:", response.data)
      console.log("Data sent:", values)
      toast("Academic year entered successfully.")

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Error submitting form.")
      } else {
        console.error("Network error:", error)
        toast("Network error.")
      }
    }
  }

  const handleClear = () => {
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Add Academic Year</h2>
          </div>
          <FormField
            control={form.control}
            name="ayStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start</FormLabel>
                <FormControl>
                  <Input {...field} type="number" value={field.value || ""} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ayEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End</FormLabel>
                <FormControl>
                  <Input {...field} type="number" value={field.value || ""} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
