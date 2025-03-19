import { enrollment2Schema } from "@/FldrSchema/userSchema.ts"
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
  rateCode: string;
  amount: number;
  rowNum: number;
};

interface Enrollment2FormProps {
  closeModal: () => void;
}

export function Enrollment2Form({ closeModal }: Enrollment2FormProps) {
  const form = useForm<Enrollment2FormData>({
    resolver: zodResolver(enrollment2Schema),
    defaultValues: {
      pkCode: "",
      rowNum: 0,
      rateCode: "",
      amount: 0,
    },
    mode: 'onChange',
  });

  const [student, setStudent] = useState<StudentCol[]>([])

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

  const [rates, setRate] = useState<RateCol[]>([]);

  const fetchRate = async () => {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListDistinctRate`);
      const mappedRate = response.data.map((item: RateCol) => ({
        label: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc}`,
        value: item.rateCode,
      }))
      setRate(mappedRate)
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStudent()
    fetchRate();
  }, [])

const [amount, setAmount] = useState<number>(0);
const [rateCode, setRateCode] = useState<string>('');

  useEffect(() => {
      const fetchRateAmountSum = async () => {
          try {
              if (rateCode) {
                  console.log("Rate Code:", rateCode)
                  const response = await axios.get(`${plsConnect()}/api/Enrollment2/SumRateAmount/${rateCode}`);
                  
                  setAmount(response.data);
                  form.setValue("amount", response.data);
              }
          } catch (error) {
              console.error("Error fetching sum of RateAmounts:", error);
          }
      };
      fetchRateAmountSum();
  }, [rateCode]);

  const [rowNum, setRowNum] = useState<number>(1);
  const [pkCode, setPkCode] = useState<string>('');

useEffect(() => {
  const checkExistingEnrollment = async (pkCode: string) => {
    try {
      const response = await axios.get(`${plsConnect()}/api/Enrollment2/CheckEnrollment/${pkCode}`);
      const newRowNum = response.data;
      setRowNum(newRowNum);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  if (pkCode) {
    checkExistingEnrollment(pkCode);
  }
}, [pkCode]);

useEffect(() => {
  const currentPkCode = form.watch("pkCode");
  if (currentPkCode && currentPkCode !== pkCode) {
    setPkCode(currentPkCode);
  }
}, [form.watch("pkCode")]);


  const onSubmit = async (values: Enrollment2FormData) => {
    const enrollment2FormData = {
      pkCode: values.pkCode,
      rateCode: values.rateCode,
      amount: values.amount,
      rowNum: rowNum,
    };

    try {
      const response = await axios.post(`${plsConnect()}/api/Enrollment2/AddEnrollment2`, enrollment2FormData)
      toast("Success.")
      closeModal();
      console.log("Values:", enrollment2FormData);
      console.log("Response:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Error submitting form.")
      } else {
        console.error("Network error:", error)
        toast("Network error.")
      }
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
            name="rateCode"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Rate</FormLabel>
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
                          ? rates.find(
                              (rates) => rates.value === field.value
                            )?.label
                          : "Select rate"}
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
                          {rates.map((rates) => (
                            <CommandItem
                              value={rates.label}
                              key={rates.value}
                              onSelect={() => {
                                  form.setValue("rateCode", rates.value);
                                  field.onChange(rates.value);
                                  setRateCode(rates.value);
                              }}
                            >
                              {rates.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  rates.value === field.value
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

          <FormField name="amount" control={form.control} render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel className="mr-2">Amount</FormLabel>
              <FormControl className="flex justify-end">
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP',
                  }).format(amount)}
                </span>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField
                control={form.control}
                name="rowNum"
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value={rowNum}
                  />
                )}
              />

        <div className="col-span-2">
          <Button type="submit" className="w-full sm:w-20 float-right">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
