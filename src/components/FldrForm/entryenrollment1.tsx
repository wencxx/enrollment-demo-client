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
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { EnrollDescCol, StudentCol } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";
import { enrollment1Schema } from "@/FldrSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Enrollment1FormData = z.infer<typeof enrollment1Schema>;

interface Enrollment1FormProps {
    toEdit?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function EntryEnrollment1Form({ toEdit = "", onCancel, onSuccess }: Enrollment1FormProps) {
  const form = useForm<Enrollment1FormData>({
          resolver: zodResolver(enrollment1Schema),
          defaultValues: {
            regularStudent: true,
          },
        });

  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentCol[]>([])
  const [enrollDesc, setEnrollDesc] = useState<EnrollDescCol[]>([])
  const [studentCode] = useState(toEdit);

  useEffect(() => {
        async function fetchData() {
          setIsLoading(true);
          try {
            const studentsRes = await axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`)
            const mappedStudentsRes = studentsRes.data.map((item: StudentCol) => ({
              label: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName} ${item.suffix} - ${item.studentCode}`,
              value: item.studentCode,
            }))
            setStudents(mappedStudentsRes)

            const EDRes = await axios.get(`${plsConnect()}/api/EnrollDescription`)
            const mappedEDRes = EDRes.data.map((item: EnrollDescCol) => ({
              label: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc} - Section ${item.sectionDesc} (${item.aYearDesc})`,
              value: item.pkedCode,
            }))
            setEnrollDesc(mappedEDRes)

            if (studentCode) {
                const entryRes = await axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`);
                const entryData = entryRes.data.find((entry: StudentCol) => entry.studentCode === studentCode);
      
                form.reset({
                  studentCode: entryData.studentCode,
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
      }, [studentCode])

  const onSubmit = async (values: Enrollment1FormData) => {
    try {
      setIsLoading(true);
        console.log("Edited:", values);
        const response = await axios.post(`${plsConnect()}/API/WEBAPI/Enrollment1Controller/InsertEnrollment1`, values);
        toast("Edited successfully.");
      
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
      <h2 className="text-lg font-semibold">Enter enrollment1</h2>
      </div>
      <div className="max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Student</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                        disabled
                      variant="outline"
                      role="combobox"
                      className={cn(
                            "flex w-auto justify-between items-start text-left gap-2 min-h-[2.5rem] h-auto",
                            !field.value && "text-muted-foreground",
                            "whitespace-normal break-words p-2"
                        )}
                    >
                      {field.value
                        ? students.find(
                            (students) => students.value === field.value
                          )?.label
                        : "Select student"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>None found.</CommandEmpty>
                      <CommandGroup>
                        {students.map((students) => (
                          <CommandItem
                            value={students.label}
                            key={students.value}
                            onSelect={() => {
                                form.setValue("studentCode", students.value);
                                field.onChange(students.value);
                            }}
                          >
                            {students.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                students.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pkedCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Enrollment Description</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? enrollDesc.find(
                            (enrollDesc) => enrollDesc.value === field.value
                          )?.label
                        : "Select enrollment description"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>None found.</CommandEmpty>
                      <CommandGroup>
                        {enrollDesc.map((enrollDesc) => (
                          <CommandItem
                            value={enrollDesc.label}
                            key={enrollDesc.value}
                            onSelect={() => {
                                form.setValue("pkedCode", enrollDesc.value);
                                field.onChange(enrollDesc.value);
                            }}
                          >
                            {enrollDesc.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                enrollDesc.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <div className="flex space-x-4">

        <div className="flex-1">
            <FormField
              control={form.control}
              name="regularStudent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Regular</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

        </div>


          <div className="flex justify-end gap-2">
           <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : ("Submit")}
            </Button>
            </div>
        </form>
      </Form>
      </div>
    </>
  );
}
