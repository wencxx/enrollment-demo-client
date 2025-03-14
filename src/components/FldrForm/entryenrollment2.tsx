import { z } from "zod"
import { enrollment2Schema } from "@/FldrSchema/userSchema.ts"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { useEffect, useState } from "react"
import { StudentCol } from "@/FldrTypes/students-col"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useAuthStore from "@/FldrStore/auth"
import { RateCol } from "@/components/FldrDatatable/rate-columns";
import { Input } from "@/components/ui/input";

type Enrollment2FormData = z.infer<typeof enrollment2Schema>

export function Enrollment2Form() {
  const form = useForm<Enrollment2FormData>({
    resolver: zodResolver(enrollment2Schema),
    defaultValues: {
      studentCode: "",
      rateCode: "",
      rateDesc: "",
      units: 0,
      amount: 0,
    },
    mode: 'onChange',
  })

  const [student, setStudent] = useState<StudentCol[]>([])
  const [studentSearch, setStudentSearch] = useState("");

  const handleStudentSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentSearch(event.target.value);
  };

  const filteredStudents = student.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.middleName.toLowerCase().includes(studentSearch.toLowerCase())
    );
  });


  async function fetchStudent() {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollment1WithName`)
      //console.log("Fetched students:", response.data);
      setStudent(response.data)
    } catch (error: any) {
      console.error("Error fetching students:", error)
    }
  }

  const [rates, setRate] = useState<RateCol[]>([]);

  const fetchRate = async () => {
    try {
      const response = await axios.get<RateCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListRate`);
      setRate(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStudent()
    fetchRate();
  }, [])

  const { currentUser } = useAuthStore.getState();

  if (!currentUser) {
    toast("User not logged in.");
    return;
  }

  const handleRateChange = (rateCode: string) => {
    const selectedRate = rates.find(rate => rate.rateCode === rateCode);
    if (selectedRate) {
      form.setValue("rateDesc", selectedRate.rateDesc);
      form.setValue("units", selectedRate.noUnits);
      form.setValue("amount", selectedRate.rateAmount);
    }
    form.setValue("rateCode", rateCode);
  };

  const onSubmit = async (values: Enrollment2FormData) => {
    console.log("Form values before submit:", values);
    const currentDate = new Date();

    // const enrollment2Data = {
    //   ...values,
    //   userCode: currentUser.userCode,
    //   tDate: currentDate,
    //   dateEncoded: currentDate,
    // }

    // try {
    //   const postResponse = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertEnrollment1`, enrollment2Data)

    //   const putResponse = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateStudentEnrollmentStatus`, enrollment2Data)

    //   console.log("Data submitted successfully:", postResponse)
    //   console.log("Data submitted successfully:", putResponse)
    //   toast("Success.")
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     toast("Error submitting form.")
    //   } else {
    //     console.error("Network error:", error)
    //     toast("Network error.")
    //   }
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 grid grid-cols-2 gap-2">

        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pending applicant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="p-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="Search for a student"
                      value={studentSearch}
                      onChange={handleStudentSearchChange}
                    />
                  </div>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <SelectItem key={student.studentCode} value={student.studentCode}>
                        {student.firstName} {student.lastName}, {student.middleName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No students available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <Table>
            <TableCaption>
              <Button type="button" variant="ghost" size="sm">
                <Plus />
              </Button>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <FormField
                    control={form.control}
                    name="rateCode"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <Select onValueChange={handleRateChange} value={field.value}>
                          {/* <Select> */}
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select code" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rates.length > 0 ? (
                              rates.map((rate) => (
                                <SelectItem key={rate.rateCode} value={rate.rateCode}>
                                  {rate.rateCode} - {rate.rateDesc}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No rates available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="w-[300px]">
                  <FormField
                    control={form.control}
                    name="rateDesc"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="w-[100px]">
                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-right w-[100px]">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} readOnly className="text-end bor" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pending applicant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="p-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="Search for a student"
                      value={studentSearch}
                      onChange={handleStudentSearchChange}
                    />
                  </div>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <SelectItem key={student.studentCode} value={student.studentCode}>
                        {student.firstName} {student.lastName}, {student.middleName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No students available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* no voucher na */}
        <div className="col-span-2">
          <Button type="submit" className="w-full sm:w-20 float-right">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
