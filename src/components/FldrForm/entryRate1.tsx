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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { CourseCol, YearCol } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";

type Rate1FormData = {
    pkRate1: string;
    yearCode: string;
    courseCode: string;
};

interface Rate1FormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function EntryRate1Form({ onCancel, onSuccess }: Rate1FormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [year, setYear] = useState<YearCol[]>([])
  const [course, setCourse] = useState<CourseCol[]>([])

  useEffect(() => {
        async function fetchData() {
          try {
            const yearRes = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListYear`)
            setYear(yearRes.data)
  
            const courseRes = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
            const mappedCourseCode = courseRes.data.map((item: CourseCol) => ({
              label: `${item.courseDesc}`,
              value: item.courseCode,
            }))
            setCourse(mappedCourseCode)
            
          } catch (error) {
            console.error("Error fetching data:", error)
            toast("Error fetching data.")
          }
        }
        fetchData()
      }, [])

  const form = useForm<Rate1FormData>({
    defaultValues: {
        pkRate1: "",
        yearCode: "",
        courseCode: "",
    },
  });

  const onSubmit = async (values: Rate1FormData) => {
    try {
      setIsLoading(true);
        console.log("Adding new room:", values);
        const response = await axios.post(`${plsConnect()}/API/WebAPI/RateController/InsertRate1`, values);
        toast("Rate1 added successfully.");
      
      console.log("API response:", response.data);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "An error occurred.";
        if (error.response?.status === 409) {
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred.");
        }
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
      <h2 className="text-lg font-semibold">Add New Rate1</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="yearCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                    {year.map((item) => (
                    <SelectItem key={item.yearCode} value={item.yearCode}>
                        {item.yearDesc}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
                <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                    />
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
            </FormItem>
          )}
        />

          <div className="flex justify-end gap-2">
           <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : ("Submit")}
            </Button>
            </div>
        </form>
      </Form>
    </>
  );
}
