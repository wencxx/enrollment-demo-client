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
import { subjectSchema } from "@/FldrSchema/userSchema.ts"
import { useEffect, useState } from "react"

type SubjectFormData = z.infer<typeof subjectSchema>

interface SubjectFormProps {
  editMode?: boolean;
  subjectToEdit?: string;
  onCancel?: () => void;
}

export function SubjectForm({ editMode = false, subjectToEdit = "", onCancel }: SubjectFormProps) {
  const [isEditing] = useState(editMode)
  const [selectedSubject] = useState(subjectToEdit)
  const [isLoading, setIsLoading] = useState(false)
  const [originalSubjectId, setOriginalSubjectId] = useState("")

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      RDID: "",
      RDDesc: "",
      // RDCode: ""
    },
  })

  // If in edit mode and there's a subject to edit, fetch its details
  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (isEditing && selectedSubject) {
        try {
          console.log(`Fetching subject details for ${selectedSubject}`)
          setIsLoading(true)
          const response = await axios.get(`${plsConnect()}/API/WEBAPI/Subject/${selectedSubject}`)
          
          console.log("Subject details received:", response.data)
          
          const subjectId = response.data.RDID || response.data.rdid;
          setOriginalSubjectId(subjectId);
          
          form.setValue("RDID", subjectId)
          form.setValue("RDDesc", response.data.RDDesc || response.data.rdDesc)
        } catch (error) {
          console.error("Error fetching subject details:", error)
          toast.error("Error fetching subject details.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isEditing && selectedSubject) {
      fetchSubjectDetails()
    }
  }, [isEditing, selectedSubject, form])

  const onSubmit = async (values: SubjectFormData) => {
    try {
      setIsLoading(true)
      let response;
      
      if (isEditing) {
        console.log("Updating subject:", values)
        
        // Create an object with the original subject code and the new values
        const updateData = {
          OldSubjectId: originalSubjectId,
          SubjectId: values.RDID,
          SubjectDesc: values.RDDesc 
        };
        
        response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateSubject`, updateData)
        toast("Subject updated successfully.")
      } else {
        console.log("Adding new subject:", values)
        response = await axios.post(`${plsConnect()}/API/WEBAPI/Subject`, {
          RDID: values.RDID,
          RDDesc: values.RDDesc
        })
        toast("Subject added successfully.")
      }
      
      console.log("API response:", response.data)
      form.reset()
      
      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Error submitting form."
        toast.error(errorMessage)
        console.error("API error:", error.response?.data);
      } else {
        console.error("Network error:", error)
        toast.error("Network error.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Subject" : "Add New Subject"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="RDID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>   
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="RDDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2">
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
