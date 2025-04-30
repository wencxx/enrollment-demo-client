"use client";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Edit2, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
import { z } from "zod";

type ComboOption = { label: string; value: string };

// Simple schema for the form
const formSchema = z.object({
  pkCode: z.string().min(1, { message: "Select a student." }),
});

type EnrollmentFormData = z.infer<typeof formSchema>;

type Enrollment2FormProps = {
  onSubmitSuccess: () => void;
  onAddRate: () => void;
};


export function Enrollment2Form({ onSubmitSuccess, onAddRate }: Enrollment2FormProps) {
  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(formSchema),

// type ComboOption = { label: string; value: string };


// type mapData = {
//   label: string;
//   value: string;
// }

// export function Enrollment2Form({ closeModal }: Enrollment2FormProps) { 

// export function Enrollment2Form({ onSubmitSuccess, onAddRate }: Enrollment2FormProps) {

//   const form = useForm<Enrollment2FormData>({
//     resolver: zodResolver(
//       z.object({
//         pkCode: z.string().min(1, { message: "Select a student." }),
//         rows: z
//           .array(enrollment2Schema.omit({ pkCode: true }))
//           .min(1, "At least one subject is required."),
//       })
//     ),
    defaultValues: {
      pkCode: "",
    },
  });


  const { control, handleSubmit, setValue } = form;

// WENCY CHANGES:
//  const [student, setStudent] = useState<mapData[]>([])

//   async function fetchStudent() {
//     try {
//       const response = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollment1WithName`)
//       const mappedStudent = response.data.map((item: StudentCol) => ({
//           label: `${item.firstName} ${item.middleName} ${item.lastName}`,
//           value: item.pkCode,
//       }))
//       setStudent(mappedStudent)
//     } catch (error: any) {
//         console.error("Error fetching students:", error)
//     }
//   }

//   const [rates, setRate] = useState<mapData[]>([]);

<!--   const { control, handleSubmit, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  }); -->


  const [students, setStudents] = useState<ComboOption[]>([]);
  const [courses, setCourses] = useState<ComboOption[]>([]);
  const [years, setYears] = useState<ComboOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [courseSubjects, setCourseSubjects] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false); // New state for edit mode

  // Fetch dropdown data
  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [studentsRes, coursesRes, yearsRes] = await Promise.all([
          axios.get(`${plsConnect()}/api/Enrollment2/ListEnrollment2Student`),
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`),
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListYear`),
        ]);
        
        setStudents(studentsRes.data.map((s: any) => ({
          label: `${s.firstName} ${s.middleName} ${s.lastName} (${s.courseDesc} - ${s.yearDesc} - ${s.sectionDesc})`,
          value: s.pkCode,
        })));
        
        setCourses(coursesRes.data.map((c: any) => ({
          label: c.courseDesc,
          value: c.courseCode,
        })));
        
        setYears(yearsRes.data.map((y: any) => ({
          label: y.yearDesc,
          value: y.yearCode,
        })));
      } catch {
        toast("Error loading dropdowns");
      }
    }
    fetchDropdowns();
  }, []);

  // Effect to fetch subjects when course and year change
  useEffect(() => {
    async function fetchCourseSubjects() {
      if (selectedYear && selectedCourse) {
        try {
          const response = await axios.get(
            `${plsConnect()}/api/Enrollment2/GetSubjectsByYearCourse/${selectedYear}/${selectedCourse}`
          );
          setCourseSubjects(response.data);
          setEditMode(false); // Reset edit mode when subjects change
        } catch (error) {
          toast.error("Failed to fetch subjects for this course and year");
          console.error(error);
        }
      } else {
        setCourseSubjects([]);
        setEditMode(false); // Reset edit mode when clearing subjects
      }
    }
    fetchCourseSubjects();
  }, [selectedYear, selectedCourse]);

  // Function to handle removing a subject
  const handleRemoveSubject = (index: number) => {
    setCourseSubjects(prevSubjects => 
      prevSubjects.filter((_, idx) => idx !== index)
    );
    toast.info("Subject removed");
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const onSubmit = async (values: EnrollmentFormData) => {
    if (courseSubjects.length === 0) {
      toast.error("No subjects available for the selected course and year");
      return;
    }

    // Create enrollment rows from all available subjects
    const rows = courseSubjects.map((subject, index) => ({
      rowNum: index + 1,
      subjectCode: subject.rdCode,
      PKRate: subject.pkRate,
      professorCode: "00000", // Default value
      roomCode: "000", // Default value
      scheduleDayCode: "00", // Default value
      classStart: "00:00", // Default time
      classEnd: "00:00", // Default time
      noUnits: subject.noUnits,
      rateAmount: subject.rateAmount,
      amount: subject.noUnits === 0 ? subject.rateAmount : subject.noUnits * subject.rateAmount,
      rateTypeCode: subject.rateTypeCode,
    }));

    const payload = {
      pkCode: values.pkCode,
      rows: rows
    };
    
    try {
      await axios.post(
        `${plsConnect()}/api/Enrollment2/AddEnrollment2`,
        payload
      );
      onSubmitSuccess();
      onAddRate();
      toast.success(`Successfully enrolled with ${rows.length} subjects!`, { 
        duration: 5000, 
        position: "top-center" 
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          toast.error("Entry already exists.")
        }
        else {
          const errorMessage = error.response?.data?.message || "Error submitting form."
          toast.error(errorMessage);
          console.error("API error:", error.response?.data)
        }
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="col-span-2 mb-6">
            {/* STUDENT SELECTION */}
            <FormField
              control={control}
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
                        ? students.find((s) => s.value === field.value)?.label
                        : "Select Student, course, year, and section"}
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
                          {students.map((s) => (
                          <CommandItem
                          value={s.label}
                          key={s.value}
                          onSelect={() => {
                            setValue("pkCode", s.value);
                            field.onChange(s.value);
                          }}
                        >
                          {s.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              s.value === field.value
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
          </div>
          
          {/* YEAR AND COURSE SELECTION */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Year Selection */}
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !selectedYear && "text-muted-foreground"
                      )}
                    >
                      {selectedYear
                        ? years.find((y) => y.value === selectedYear)?.label
                        : "Select Year"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search years..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No year found.</CommandEmpty>
                      <CommandGroup>
                        {years.map((year) => (
                          <CommandItem
                            key={year.value}
                            value={year.label}
                            onSelect={() => {
                              setSelectedYear(year.value);
                              setCourseSubjects([]);
                            }}
                          >
                            {year.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedYear === year.value ? "opacity-100" : "opacity-0"
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

            {/* Course Selection */}
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !selectedCourse && "text-muted-foreground"
                      )}
                    >
                      {selectedCourse
                        ? courses.find((c) => c.value === selectedCourse)?.label
                        : "Select Course"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search courses..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No course found.</CommandEmpty>
                      <CommandGroup>
                        {courses.map((course) => (
                          <CommandItem
                            key={course.value}
                            value={course.label}
                            onSelect={() => {
                              setSelectedCourse(course.value);
                              setCourseSubjects([]);
                            }}
                          >
                            {course.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedCourse === course.value ? "opacity-100" : "opacity-0"
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
          </div>

          {/* AVAILABLE SUBJECTS LIST - DISPLAY ONLY */}
          {courseSubjects.length > 0 && (
            <div className="border rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Subjects to be Added ({courseSubjects.length})</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleEditMode}
                  className="flex items-center gap-1"
                >
                  {editMode ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Subject</th>
                      <th className="py-2 px-4 text-right">Units</th>
                      {/* <th className="py-2 px-4 text-right">Rate</th> */}
                      {editMode && <th className="py-2 px-4 text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {courseSubjects.map((subject, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{subject.rdDesc}</td>
                        <td className="py-2 px-4 text-right">{subject.noUnits}</td>
                        {/* <td className="py-2 px-4 text-right">{subject.rateAmount.toFixed(2)}</td> */}
                        {editMode && (
                          <td className="py-2 px-4 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSubject(idx)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold">
                      <td className="py-2 px-4">Total</td>
                      <td className="py-2 px-4 text-right">
                        {courseSubjects.reduce((sum, subject) => sum + (subject.noUnits || 0), 0)}
                      </td>
                      {/* <td className="py-2 px-4 text-right">
                        {courseSubjects
                          .reduce((sum, subject) => sum + (subject.rateAmount || 0), 0)
                          .toFixed(2)}
                      </td> */}
                      {editMode && <td className="py-2 px-4"></td>}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              className="w-auto"
              disabled={!form.watch("pkCode") || courseSubjects.length === 0 || editMode}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}