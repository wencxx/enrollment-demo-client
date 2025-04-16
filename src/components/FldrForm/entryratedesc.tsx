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
import { rateDescSchema } from "@/FldrSchema/userSchema"
import { useEffect, useState } from "react"

type RateDescFormData = z.infer<typeof rateDescSchema>

interface RateDescFormProps {
  editMode?: boolean;
  RDToEdit?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function RateDescForm({ editMode = false, RDToEdit = "", onCancel }: RateDescFormProps) {
  const [isEditing] = useState(editMode)
  const [selectedRateDesc] = useState(RDToEdit)
  const [isLoading, setIsLoading] = useState(false)
  const [originalRDID, setOriginalRDID] = useState("")

  const form = useForm<RateDescFormData>({
    resolver: zodResolver(rateDescSchema),
    defaultValues: {},
  })

  useEffect(() => {
    const fetchRateDesc = async () => {
      if (isEditing && selectedRateDesc) {
        try {
          console.log(`Fetching rate description details for ${selectedRateDesc}`)
          setIsLoading(true)
          const response = await axios.get(`${plsConnect()}/API/WebAPI/RateController/GetRateDesc/${selectedRateDesc}`)
          console.log("Rate description details received:", response.data)

          const rdid = response.data.RDID ?? response.data.rdid
          setOriginalRDID(rdid)
          form.setValue("RDID", rdid)
          form.setValue("RDDesc", response.data.RDDesc ?? response.data.rdDesc)
          form.setValue("OldRDID" , rdid)
        } catch (error) {
          console.error("Error fetching rate description details:", error)
          toast.error("Error fetching rate description details.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isEditing && selectedRateDesc) {
      fetchRateDesc()
    }
  }, [isEditing, selectedRateDesc, form])

  const onSubmit = async (values: RateDescFormData) => {
    try {
      setIsLoading(true)
      let response

      if (isEditing) {
        console.log("Updating rate description:", values)
        const updateData = {
          OldRDID: originalRDID,
          RDID: values.RDID,
          RDDesc: values.RDDesc,
        }
        console.log("Connection URL:", plsConnect());
        response = await axios.put(`${plsConnect()}/API/WebAPI/RateController/UpdateRateDesc`, updateData)
        toast("Rate description updated successfully.")
      } else {
        console.log("Connection URL:", plsConnect());
        console.log("Adding new rate description:", values)
        response = await axios.post(`${plsConnect()}/API/WebAPI/RateController/InsertRateDesc`, {
          RDID: values.RDID, 
          RDDesc: values.RDDesc
        })
        toast("Rate description added successfully.")
      }

      console.log("API response:", response.data)
      form.reset()
      if (onCancel) {
        onCancel()
      }

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          toast.error("Rate description ID already exists.")
        }
        else {
          const errorMessage = error.response?.data?.message || "Error submitting form."
          toast.error(errorMessage);
          console.error("API error:", error.response?.data)
        }
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
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Rate Description" : "Add New Rate Description"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="RDID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Description ID</FormLabel>
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
                <FormLabel>Rate Description</FormLabel>
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