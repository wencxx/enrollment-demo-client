import { enrollment3Schema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Check } from 'lucide-react'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { Enrollment3Type } from "@/FldrTypes/enrollment3"
import { toast } from "sonner"
import { Enrollment3Type2 } from "@/FldrTypes/enrollment3"

type mapStudentsCol = {
  label: string;
  value: string;
  totalAmount: number;
}

export function Enrollment3Form({ setList, setDialogOpen }: { setList: React.Dispatch<React.SetStateAction<Enrollment3Type2[]>>, setDialogOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const form = useForm<Enrollment3Type2>({
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


  const fetchEnrollment2 = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/api/Enrollment2/AllData`);

      if (res.status) {
        const studentMap = new Map<string, mapStudentsCol>();

        res.data.forEach((item: Enrollment3Type) => {
          const fullName = `${item.firstName} ${item.middleName} ${item.lastName}`;
          const existing = studentMap.get(item.pkCode);

          if (existing) {
            existing.totalAmount += item.amount;
          } else {
            studentMap.set(item.pkCode, {
              label: fullName,
              value: item.pkCode,
              totalAmount: item.amount,
            });
          }
        });

        const aggregatedStudents = Array.from(studentMap.values());
        setStudent(aggregatedStudents);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchEnrollment2();
  }, []);

  const onSubmit = async (values: Enrollment3Type2) => {
    try {
      const res = await axios.post(`${plsConnect()}/WebApi/Assessment/Enrollment3/${values.pkCode}`, values);

      if (res.status === 200) {
        toast.success("Successfully added enrollment 3")
        setList((prev) => [res.data, ...prev]);
        setDialogOpen(false)
      } else {
        toast.error("Failed adding enrollment 3")
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
                              form.setValue("debit", student.totalAmount);
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
          name="debit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input type="number" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount Paid</FormLabel>
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
