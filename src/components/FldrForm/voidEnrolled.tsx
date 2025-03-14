import { z } from "zod"
import { voidSchema } from "@/FldrSchema/userSchema"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { studentCodeProps } from "@/FldrTypes/studentCode"

type voidFormData = z.infer<typeof voidSchema>

export function VoidEnrolledForm({ studentCode, closeModal }: studentCodeProps) {
  const [isVoided, setIsVoided] = useState<boolean | null>(null)
  const form = useForm<voidFormData>({
    resolver: zodResolver(voidSchema),
    defaultValues: {
      void: false,
    },
    mode: 'onChange',
  })

  const fetchVoidStatus = async () => {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/VariousController/GetStudentVoidStatus/${studentCode}`)

      if (response.data) {
        console.log("API Response Data:", response.data);
        const { void: Void } = response.data;
        console.log("Fetched Void Status:", Void);
        setIsVoided(Void);
        form.setValue("void", Void);
      }
    } catch (error) {
      console.error("Error fetching void status:", error)
      toast("Failed to load student status.")
    }
  }

  useEffect(() => {
    fetchVoidStatus();
  }, [studentCode]);

  const onSubmit = async (values: voidFormData) => {
    try {
      const voidStatus = values.void;
      const invertedVoidStatus = !voidStatus;

      const response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateEnrollment1VoidStatus`, {
        studentCode,
        void: invertedVoidStatus,
      });
      closeModal();
      toast("Status updated successfully.");
      console.log("Successful update: ", response)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Error submitting form.")
      } else {
        console.error("Network error:", error)
        toast("Network error.")
      }
    }
  }

  if (isVoided === null) {
    return <div>Loading status...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <div className="text-center">
            <p className="text-lg">
              Are you sure you want to {isVoided ? "reinstate" : "void"} this student?
            </p>
            <p className="text-sm text-gray-600">
              This student is currently {isVoided ? "voided" : "enrolled"}. This action will {isVoided ? "restore" : "un-enroll"} the student.
            </p>
          </div>
        </div>

        <input
          type="hidden"
          {...form.register("void")}
          value={isVoided ? "true" : "false"}
        />

        <div className="col-span-2 flex justify-between gap-2">
          <Button
            type="button"
            onClick={() => closeModal()}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="lg"
            variant={isVoided ? "green" : "red"}
          >
            {isVoided ? "Reinstate" : "Void"}
          </Button>
        </div>
      </form>
    </Form>

  )
}
