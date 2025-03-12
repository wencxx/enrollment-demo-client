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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { entryRateSchema } from "@/FldrSchema/userSchema.ts";
import { useEffect, useState } from "react";
import { Year } from "@/FldrTypes/year";
import { Sem } from "@/FldrTypes/sem";
import { CourseCol } from "@/FldrTypes/course.col";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type RateCourseFormData = z.infer<typeof entryRateSchema>;

export function RateCourseForm() {
  const form = useForm<RateCourseFormData>({
    resolver: zodResolver(entryRateSchema),
    defaultValues: {
      yearCode: "",
      courseCode: "",
      semCode: "",
    },
    mode: "onChange",
  });

  const [years, setYears] = useState<Year[]>([]);
  const [sem, setSem] = useState<Sem[]>([]);
  const [course, setCourse] = useState<CourseCol[]>([]);

  async function fetchYears() {
    try {
      const response = await axios.get(
        `${plsConnect()}/API/WEBAPI/ListController/ListYear`
      );
      setYears(response.data);
    } catch (error: any) {
      console.error("Error fetching years:", error);
    }
  }

  async function fetchSem() {
    try {
      const response = await axios.get(
        `${plsConnect()}/API/WEBAPI/ListController/ListSemester`
      );
      setSem(response.data);
    } catch (error: any) {
      console.error("Error fetching semseters:", error);
    }
  }

  async function fetchCourse() {
    try {
      const response = await axios.get(
        `${plsConnect()}/API/WEBAPI/ListController/ListCourse`
      );
      const mappedCourseCode = response.data.map((item: CourseCol) => ({
        label: item.courseDesc,
        value: item.courseCode,
      }));
      setCourse(mappedCourseCode);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
    }
  }

  useEffect(() => {
    fetchYears();
    fetchSem();
    fetchCourse();
  }, []);

  const onSubmit = async (values: RateCourseFormData) => {
    const rateCourseData = {
      yearCode: values.yearCode,
      courseCode: values.courseCode,
      semCode: values.semCode,
    };

    try {
      const response = await axios.post(
        `${plsConnect()}/API/WEBAPI/InsertEntry/InsertEntryRateCourse`,
        rateCourseData
      );

      if (response.data) {
        console.log("Data submitted successfully:", response.data);
        toast("New Rate Course registered successfully.");

        console.log("API Response:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Error submitting form.");
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Network error:", error);
        toast("Network error.");
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="yearCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.length > 0 ? (
                      years.map((year) => (
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
            control={form.control}
            name="semCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sem.length > 0 ? (
                      sem.map((sem) => (
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

          <FormField
            control={form.control}
            name="courseCode"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Course</FormLabel>
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
                          ? course.find(
                              (course) => course.value === field.value
                            )?.label
                          : "Select course"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>None found.</CommandEmpty>
                        <CommandGroup>
                          {course.map((course) => (
                            <CommandItem
                              value={course.label}
                              key={course.value}
                              onSelect={() => {
                                form.setValue("courseCode", course.value);
                                field.onChange(course.value);
                              }}
                            >
                              {course.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  course.value === field.value
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
