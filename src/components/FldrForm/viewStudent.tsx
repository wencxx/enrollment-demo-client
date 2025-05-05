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
import { Check } from "lucide-react";
import { EnrollDescCol, Enrollment1Col, StudentCol } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";
import { enrollment1Schema } from "@/FldrSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";

type StudentData = {
    studentCode: string;
    firstName: number;
    middleName: string;
    lastName: string;
    suffix: string;

    enrollStatusCode: string;
    enrollStatusDesc: string;
    genderCode: string;

    address: string;
    birthDate: string;
    contactNo: string;
    emailAddress: string;
    userCode: string;
}

interface StudentProps {
    toEdit?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function ViewStudent({ toEdit = "", onCancel, onSuccess }: StudentProps) {
  const form = useForm<StudentData>({
          resolver: zodResolver(enrollment1Schema),
        //   defaultValues: {
        //     regularStudent: true,
        //   },
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
              label: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName} ${item.suffix}`,
              value: item.studentCode,
            }))
            setStudents(mappedStudentsRes)


            if (studentCode) {
              const entryRes = await axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`);
              const entryData = entryRes.data.find((entry: StudentCol) => entry.studentCode === studentCode);
                form.reset({
                  studentCode: entryData.studentCode,
                  address: entryData.address,
                  birthDate: entryData.birthDate,
                  emailAddress: entryData.emailAddress,
                  contactNo: entryData.contactNo,
                  enrollStatusDesc: entryData.enrollStatusDesc,
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

  const onSubmit = async (values: StudentData) => {
    console.log("placeholder")
  };

  return (
    <>
      <div className="max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* start row */}
        <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Full Name</FormLabel>
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
                            "whitespace-normal break-words p-2",
                            "not-muted-disabled"
                        )}
                    >
                      {field.value
                        ? students.find(
                            (students) => students.value === field.value
                          )?.label
                        : "Select student"}
                      {/* <ChevronsUpDown className="opacity-50" /> */}
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
        </div>

        <div className="flex-1 min-w-[200px]">
        <FormField
            disabled
            control={form.control}
            name="studentCode"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Student Code</FormLabel>
                <FormControl>
                <Input className="not-muted-disabled" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        </div>
    </div>

    <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
        <FormField
            disabled
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                <Input className="not-muted-disabled" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        </div>

        <div className="flex-1 min-w-[200px]">
        <FormField
            disabled
            control={form.control}
            name="contactNo"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                <Input className="not-muted-disabled" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        </div>
    </div>

        <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
        <FormField
            disabled
            control={form.control}
            name="address"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                <Input className="not-muted-disabled" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        </div>

        <div className="flex-1 min-w-[200px]">
        <FormField
            disabled
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Birthdate</FormLabel>
                    <FormControl>
                    <Input className="not-muted-disabled" {...field} />
                    </FormControl>
                </FormItem>
                )}
            />
        </div>
    </div>

    <div className="flex-1 min-w-[200px] mb-2">
        <FormField
            disabled
            control={form.control}
            name="enrollStatusDesc"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Enrollment status</FormLabel>
                <FormControl>
                <Input className="not-muted-disabled" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        </div>

        {/* <div className="flex space-x-4 mt-2 mb-2">

        <div className="flex-1">
            <FormField
              control={form.control}
              name="regularStudent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                    disabled
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

          <div className="flex-1">
            <FormField
              control={form.control}
              name="approveStudent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                        disabled
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Approved</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

        </div> */}
        </form>
      </Form>
      </div>
    </>
  );
}
