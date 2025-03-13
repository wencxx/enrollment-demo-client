import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { studentEditSchema } from "@/FldrSchema/userSchema";
import { studentProfile } from "@/FldrTypes/enrollment1";


type StudentFormData = z.infer<typeof studentEditSchema> & {
    firstName: string
    middleName:  string
    lastName: string
    address: string
    birthDate: Date
    courseCode: string
    yearCode: string
    semCode: string
};

interface StudentFormProps {
  studentCode: string;
  onSubmitSuccess: (updatedStudent: studentProfile) => void;
  defaultValues: {
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    birthDate: "",
    courseCode: "",
    yearCode: "",
    semCode: "",
  },
}

const fetchPkCode = async (studentCode: string) => {
    try {
      const response = await axios.get(`${plsConnect()}/API/WEBAPI/GetEnrollmentByStudent/${studentCode}`);
      return response.data.pkCode;
    } catch (error) {
      return null; 
    }
  };

export function EditStudent({ studentCode, onSubmitSuccess }: StudentFormProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const form = useForm<StudentFormData>({
      resolver: zodResolver(studentEditSchema),
      },
    );
  
    useEffect(() => {
        if (!studentCode) return;
      
        const fetchStudent = async () => {
          try {
            console.log(`Fetching student details for: ${studentCode}`);
            const response = await axios.get(
              `${plsConnect()}/API/WEBAPI/ListController/ListStudentEnrollment2?studentCode=${studentCode}`
            );
            console.log("Fetched Data:", response.data);
      
            form.reset({
              studentCode: response.data.studentCode || "",
              firstName: response.data.firstName || "",
              middleName: response.data.middleName || "",
              lastName: response.data.lastName || "",
              address: response.data.address || "",
              birthDate: response.data.birthDate
                ? format(new Date(response.data.birthDate), "yyyy-MM-dd")
                : "",
              courseCode: response.data.courseCode || "",
              yearCode: response.data.yearCode || "",
              semCode: response.data.semCode || "",
            });
      
            setLoading(false);
          } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch student details.");
            setLoading(false);
          }
        };
      
        fetchStudent();
      }, [studentCode]);


    const onSubmit = async (values: StudentFormData) => {
        try {
          const pkCode = await fetchPkCode(values.studentCode);
          if (!pkCode) {
            toast("Error: Unable to fetch enrollment record.");
            return;
          }
      
          const formattedValues = {
            pkCode,
            studentCode: values.studentCode,
            firstName: values.firstName,
            middleName: values.middleName,
            lastName: values.lastName,
            address: values.address,
            birthDate: values.birthDate ? format(new Date(values.birthDate), "yyyy-MM-dd") : "",
            courseCode: values.courseCode,
            yearCode: values.yearCode,
            semCode: values.semCode,
          };
    
          const response = await axios.put(
            `${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateStudentEnrollment2`,
            formattedValues,
          );
      
          toast("Student details updated successfully.");
      
          const updatedStudent: studentProfile = {
            pkCode: formattedValues.pkCode,
            studentCode: formattedValues.studentCode,
            firstName: formattedValues.firstName,
            middleName: formattedValues.middleName,
            lastName: formattedValues.lastName,
            address: formattedValues.address,
            birthDate: new Date(formattedValues.birthDate),
            courseCode: formattedValues.courseCode,
            yearCode: formattedValues.yearCode,
            semCode: formattedValues.semCode,
          };
      
          onSubmitSuccess(updatedStudent);
        } catch (error: any) {
          toast("Error updating student details.");
        }
      };

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4">
          <FormField name="firstName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="middleName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="lastName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="birthDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="address" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="courseCode" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Course Code</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="yearCode" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Year Code</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="semCode" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Semester Code</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="float-right">Update</Button>
        </form>
      </Form>
    </>
  );
}
