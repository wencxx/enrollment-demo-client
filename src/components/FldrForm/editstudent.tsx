import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save } from "lucide-react";
import React from "react";

type StudentFormData = z.infer<typeof studentEditSchema> & {
  firstName: string;
  middleName: string;
  lastName: string;
  // address: string;
  birthDate: Date;
  courseCode: string;
  courseDesc: string;
  yearCode: string;
  yearDesc: string;
  semCode: string;
  semDesc: string;
};

interface StudentFormProps {
  studentCode: string;
  onSubmitSuccess: (updatedStudent: studentProfile) => void;
  courseCode: string;
}

const fetchPkCode = async (studentCode: string) => {
  try {
    const response = await axios.get(
      `${plsConnect()}/API/WEBAPI/StudentController/GetEnrollmentByStudent/${studentCode}`
    );
    return response.data.pkCode;
  } catch (error) {
    return null;
  }
};

export const EditStudent =  ({ studentCode, onSubmitSuccess }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dropdownData, setDropdownData] = useState({
      courseList: [],
      yearList: [],
      semList: [],
    });
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<StudentFormData>({
      resolver: zodResolver(studentEditSchema),
    });


    useEffect(() => {
      if (!studentCode) return;

      const fetchStudent = async () => {
        try {
          const response = await axios.get(
            `${plsConnect()}/API/WEBAPI/ListController/ListStudentEnrollment1?studentCode=${studentCode}`
          );
          form.reset({
            studentCode: response.data.studentCode,
            firstName: response.data.firstName || "",
            middleName: response.data.middleName || "",
            lastName: response.data.lastName || "",
            // address: response.data.address || "",
            birthDate: response.data.birthDate
              ? new Date(response.data.birthDate).toISOString().split("T")[0]
              : "",
            courseCode: response.data.courseCode || "",
            courseDesc: response.data.courseDesc || "",
            yearCode: response.data.yearCode || "",
            yearDesc: response.data.yearDesc || "",
            semCode: response.data.semCode || "",
            semDesc: response.data.semDesc || "",
          });
          setLoading(false);
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Failed to fetch student details.");
          setLoading(false);
        }
      };

      const fetchDropdownData = async () => {
        try {
          const response = await axios.get(
            `${plsConnect()}/API/WEBAPI/ListController/ListDropdownData`
          );
          setDropdownData(response.data);
        } catch (err) {
          console.error("Dropdown fetch error:", err);
        }
      };

      fetchStudent();
      fetchDropdownData();
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
          // address: values.address,
          birthDate: values.birthDate
            ? new Date(values.birthDate).toISOString().split("T")[0]
            : "",
          courseCode: values.courseCode,
          courseDesc:
            dropdownData.courseList.find(
              (c) => c.courseCode === values.courseCode
            )?.courseDesc || "",
          yearCode: values.yearCode,
          yearDesc:
            dropdownData.yearList.find((y) => y.yearCode === values.yearCode)
              ?.yearDesc || "",
          semCode: values.semCode,
          semDesc:
            dropdownData.semList.find((s) => s.semCode === values.semCode)
              ?.semDesc || "",
        };

        await axios.put(
          `${plsConnect()}/API/WEBAPI/StudentController/UpdateStudentEnrollment1`,
          formattedValues
        );

        toast("Student details updated successfully.");

        onSubmitSuccess({
          ...formattedValues,
          birthDate: new Date(formattedValues.birthDate),
        });
      } catch (error: any) {
        toast("Error updating student details.");
      }
    };

    if (loading) return <p>Loading student details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name & Middle Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="middleName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Last Name & Birth Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="birthDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address (Full Width) */}
          {/* <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Course (Full Width) */}
          <FormField
            name="courseCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={true}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdownData.courseList.length > 0 ? (
                      dropdownData.courseList.map((course) => (
                        <SelectItem
                          key={course.courseCode}
                          value={course.courseCode}
                        >
                          {course.courseDesc}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No courses available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Year & Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="yearCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdownData.yearList.length > 0 ? (
                        dropdownData.yearList.map((year) => (
                          <SelectItem key={year.yearCode} value={year.yearCode}>
                            {year.yearDesc}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No years available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="semCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdownData.semList.length > 0 ? (
                        dropdownData.semList.map((sem) => (
                          <SelectItem key={sem.semCode} value={sem.semCode}>
                            {sem.semDesc}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No semesters available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4" />
                  Update
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    );
  }

