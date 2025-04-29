import { useForm } from "react-hook-form";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    //   FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, Save } from "lucide-react";
import { EnrollStatusCol } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";

type EnrollStatusData = {
    studentCode: string;
    enrollStatusCode: string;
};

interface Rate1FormProps {
    toEdit?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function EditEnrollStatus({ toEdit = "", onCancel, onSuccess }: Rate1FormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<EnrollStatusCol[]>([])
  const [studentCode] = useState(toEdit);

  const form = useForm<EnrollStatusData>({
    defaultValues: {
        studentCode: "",
        enrollStatusCode: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const yearRes = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollStatus`)
        setStatus(yearRes.data)

        if (studentCode) {
            const entryRes = await axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`);
            const entryData = entryRes.data.find((entry: EnrollStatusData) => entry.studentCode === studentCode);
            
            console.log(entryData)
            form.reset({
                studentCode: entryData.studentCode,
                enrollStatusCode: entryData.enrollStatusCode,
            });
          }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast("Error fetching data.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [studentCode]);

  const onSubmit = async (values: EnrollStatusData) => {
    try {
      setIsLoading(true);
        const response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateStudentEnrollmentStatus`, values);
        toast("Enrollment status updated successfully.");
      
      console.log("API response:", response.data);
      if (onSuccess) {
        onSuccess();
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "An error occurred.";
        if (error.response?.status === 409) {
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error("API error:", error.response?.data);
      } else {
        console.error("Network error:", error);
        toast.error("Network error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
        control={form.control}
        name="enrollStatusCode"
        render={({ field }) => (
        <FormItem>
            <FormLabel>Enroll Status</FormLabel>
            <Select
                onValueChange={(value) => {
                form.setValue("enrollStatusCode", value);
                field.onChange(value);
                }}
                value={field.value}
            >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
                {status.map((item) => (
                <SelectItem key={item.enrollStatusCode} value={item.enrollStatusCode}>
                    {item.enrollStatusDesc}
                </SelectItem>
                ))}
            </SelectContent>
        </Select>
        </FormItem>
        )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
           <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                <Save/>
                Update
                </span>
            )}
            </Button>
        </div>
        </form>
      </Form>
    </>
  );
}
