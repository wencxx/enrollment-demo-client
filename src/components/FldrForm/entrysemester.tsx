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
import { semesterSchema } from "@/FldrSchema/userSchema.ts"
import { Semester } from "@/FldrTypes/types";


type AcadYearFormData = z.infer<typeof semesterSchema>

interface AcadYearFormProps {
  onSuccess?: () => void;
  semesters: Semester[]
}

export function SemesterForm({ onSuccess, semesters }: AcadYearFormProps) {
  const form = useForm<AcadYearFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      semDesc: undefined,
    },
  })

  const onSubmit = async (values: AcadYearFormData) => {

    const alreadyExisting = semesters.find((sem) => sem.semDesc === values.semDesc)


    if(alreadyExisting) return toast.warning('Semester year already exist.')

    const data = {
    //   semCode: '5',
      ...values
    }

    try {
      await axios.post(`${plsConnect()}/api/Semester`, data)
      toast("Semester year entered successfully.")

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
            <h2 className="text-xl font-semibold">Add Semester</h2>
          </div>
          <FormField
            control={form.control}
            name="semDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value)} />
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