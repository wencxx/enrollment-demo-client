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
import { courseSchema } from "@/FldrSchema/userSchema";
import { CourseCol } from "@/FldrTypes/course.col";

type CourseFormData = z.infer<typeof courseSchema> & {
    courseDesc: string
};

interface CourseFormProps {
  courseCode: string;
  onSubmitSuccess: (updatedCourse: CourseCol) => void;
  defaultValues: {
    courseDesc: "",
  },
}

export function EditCourse({ courseCode, onSubmitSuccess }: CourseFormProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const form = useForm<CourseFormData>({
      resolver: zodResolver(courseSchema),
      },
    );
  
    useEffect(() => {
        if (!courseCode) return;
      
        const fetchCourse = async () => {
          try {
            console.log(`Fetching course details for: ${courseCode}`);
            const response = await axios.get(
              `${plsConnect()}/API/WebAPI/ListController/GetCourse?courseCode=${courseCode}`
            );
            console.log("Fetched Data:", response.data);
      
            form.reset({
              courseDesc: response.data.courseDesc || "",
            });
      
            setLoading(false);
          } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch course details.");
            setLoading(false);
          }
        };
      
        fetchCourse();
      }, [courseCode]);


    const onSubmit = async (values: CourseFormData) => {
        try {      
          const formattedValues = {
            courseCode,
            courseDesc: values.courseDesc,
          };
    
          const response = await axios.put(
            `${plsConnect()}/API/WEBAPI/UpdateEntry/UpdateCourse`,
            formattedValues,
            
          );
          console.log("api", response);
      
          toast("Course details updated successfully.");
      
          const updatedCourse: CourseCol = {
            courseCode: formattedValues.courseCode,
            courseDesc: formattedValues.courseDesc,
          };
      
          onSubmitSuccess(updatedCourse);
        } catch (error: any) {
          toast("Error updating course details.");

        }
      };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4">
          <FormField name="courseDesc" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Course Descriptionnn</FormLabel>
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
