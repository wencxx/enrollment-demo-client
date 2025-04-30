import { enrollment3Schema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { StudentCol } from "@/FldrTypes/students-col"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus, Minus, ChevronsUpDown, Check } from 'lucide-react'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useAuthStore from "@/FldrStore/auth"
import { RateCol } from "@/components/FldrDatatable/rate-columns";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

type Enrollment2FormData = {
  pkCode: string;
  credit: number;
  debit: number;
  remarks: string;
};

type mapStudentsCol = {
  label: string;
  value: string;
}

export function Enrollment3Form() {
  const form = useForm<Enrollment2FormData>({
    resolver: zodResolver(enrollment3Schema),
    defaultValues: {
      pkCode: "",
      credit: 0,
      debit: 0,
      remarks: "",
    },
    mode: 'onChange',
  });

  const [student, setStudent] = useState<mapStudentsCol[]>([])

  async function fetchStudent() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollment1WithName`)
      const mappedStudent = response.data.map((item: StudentCol) => ({
        label: `${item.firstName} ${item.middleName} ${item.lastName}`,
        value: item.pkCode,
      }))
      setStudent(mappedStudent)
    } catch (error: any) {
      console.error("Error fetching students:", error)
    }
  }

  useEffect(() => {
    fetchStudent()
  }, [])



  const onSubmit = async (values: Enrollment2FormData) => {
    console.log(values)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 gap-2">
        <FormField
          control={form.control}
          name="pkCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Student</FormLabel>
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
                        ? student.find(
                          (student) => student.value === field.value
                        )?.label
                        : "Select student"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>None found.</CommandEmpty>
                      <CommandGroup>
                        {student.map((student) => (
                          <CommandItem
                            value={student.label}
                            key={student.value}
                            onSelect={() => {
                              form.setValue("pkCode", student.value);
                              field.onChange(student.value);
                            }}
                          >
                            {student.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                student.value === field.value
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
              <FormMessage />
            </FormItem>

          )}
        />

        <FormField
          control={form.control}
          name="credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="debit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Debit</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <Button type="submit" className="w-full sm:w-20 float-right">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
