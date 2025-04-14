import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { courseSchema } from "@/FldrSchema/userSchema.ts";
import { useEffect, useState } from "react";

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  editMode?: boolean;
  courseToEdit?: string;
  onCancel?: () => void;
}

export function CourseForm({ editMode = false, courseToEdit = "", onCancel }: CourseFormProps) {
  const [isEditing] = useState(editMode);
  const [selectedCourse] = useState(courseToEdit);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: "",
      courseDesc: "",
    },
  });

  // If in edit mode and there's a course to edit, fetch its details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (isEditing && selectedCourse) {
        try {
          setIsLoading(true);
          const response = await axios.get(`${plsConnect()}/API/WebAPI/ListController/GetCourse?courseCode=${selectedCourse}`);
          
          console.log("Course details received:", response.data);
          
          form.setValue("courseCode", response.data.CourseCode || response.data.courseCode);
          form.setValue("courseDesc", response.data.CourseDesc || response.data.courseDesc);
        } catch (error) {
          console.error("Error fetching course details:", error);
          toast.error("Error fetching course details.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isEditing && selectedCourse) {
      fetchCourseDetails();
    }
  }, [isEditing, selectedCourse, form]);

  const onSubmit = async (values: CourseFormData) => {
    try {
      setIsLoading(true);
      let response;
      
      if (isEditing) {
        console.log("Updating course:", values);
        response = await axios.put(`${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateCourse`, {
          CourseCode: values.courseCode,
          CourseDesc: values.courseDesc
        });
        toast("Course updated successfully.");
      } else {
        console.log("Adding new course:", values);
        response = await axios.post(`${plsConnect()}/API/WEBAPI/InsertEntry/InsertCourse`, {
          CourseDesc: values.courseDesc
        });
        toast("Course added successfully.");
      }
      
      console.log("API response:", response.data);
      form.reset();
      
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Error submitting form.";
        toast.error(errorMessage);
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
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Course" : "Add New Course"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {isEditing && (
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="courseDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2">
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
