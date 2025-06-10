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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { assignSubjectSchema } from "@/FldrSchema/userSchema.ts"
import { useEffect, useState } from "react"


type AssignSubjectFormDataFormData = z.infer<typeof assignSubjectSchema>

export function AssignSubjectForm({ setOpenForm, getAssignedSubjects }: { setOpenForm: (open: boolean) => void, getAssignedSubjects: () => void }) {
  const [professors, setProfessors] = useState<{ professorCode: string; professorName: string }[]>([])
  const [enrollDescriptions, setEnrollDescriptions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => {
    axios.get(`${plsConnect()}/api/Professors`).then(res => setProfessors(res.data))
    axios.get(`${plsConnect()}/api/EnrollDescription`).then(res => setEnrollDescriptions(res.data))
    axios.get(`${plsConnect()}/API/WEBAPI/Subject/all`).then(res => setSubjects(res.data))
  }, [])

  const form = useForm<AssignSubjectFormDataFormData>({
    resolver: zodResolver(assignSubjectSchema),
    defaultValues: {
      professorCode: "",
      pkedCode: "",
      rdCode: "",
    },
  })

  const onSubmit = async (values: AssignSubjectFormDataFormData) => {
    try {
      const response = await axios.post(`${plsConnect()}/API/WebAPI/SubjectAssignment`, values)

      console.log("Data submitted successfully:", response.data)
      setOpenForm(false)
      getAssignedSubjects()
      toast("Subject assigned successfully.")
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
        {/* Select Professor */}
        <FormField
          control={form.control}
          name="professorCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Professor</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full max-w-full truncate">
                    <SelectValue placeholder="Select Professor" className="truncate" />
                  </SelectTrigger>
                  <SelectContent className="w-full break-words">
                    {professors.map((prof) => (
                      <SelectItem key={prof.professorCode} value={prof.professorCode} className="truncate max-w-full">
                        {prof.professorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Select Enroll Description */}
        <FormField
          control={form.control}
          name="pkedCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Enroll Description</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full max-w-full truncate">
                    <SelectValue placeholder="Select Enroll Description" className="truncate" />
                  </SelectTrigger>
                  <SelectContent className="w-full break-words">
                    {enrollDescriptions.map((desc) => (
                      <SelectItem key={desc.pkedCode} value={desc.pkedCode} className="truncate max-w-full">
                        {desc.yearDesc} - {desc.semDesc} - {desc.courseDesc} - {desc.sectionDesc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Select Subject */}
        <FormField
          control={form.control}
          name="rdCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Subject</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full max-w-full truncate">
                    <SelectValue placeholder="Select Subject" className="truncate" />
                  </SelectTrigger>
                  <SelectContent className="w-full break-words">
                    {subjects.map((subj) => (
                      <SelectItem key={subj.rdCode} value={subj.rdCode} className="truncate max-w-full">
                        {subj.rdDesc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
