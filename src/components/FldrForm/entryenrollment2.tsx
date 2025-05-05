"use client";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Edit2, Plus, Save, Trash2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

type ComboOption = { label: string; value: string };

type Student = {
  pkCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  courseDesc: string;
  courseCode: string;
  yearDesc: string;
  yearCode: string;
  sectionDesc: string;
};

const formSchema = z.object({});

type EnrollmentFormData = z.infer<typeof formSchema>;

type Enrollment2FormProps = {
  onSubmitSuccess: () => void;
  onAddRate: () => void;
  preselectedStudent: Student;
};


export function Enrollment2Form({ onSubmitSuccess, onAddRate, preselectedStudent }: Enrollment2FormProps) {
  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { control, handleSubmit } = form;


//export function Enrollment2Form({ onSubmitSuccess, onAddRate }: Enrollment2FormProps) {
 // const form = useForm<EnrollmentFormData>({
   // resolver: zodResolver(formSchema),

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
  //  defaultValues: {
   //   pkCode: "",
   // },
 // });


  //const { control, handleSubmit, setValue } = form;

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

 //const { control, handleSubmit, setValue, watch } = form;
 // const { fields, append, remove } = useFieldArray({
  //  control,
  //  name: "rows",
 // }); 


  //const [students, setStudents] = useState<ComboOption[]>([]);

  const [courses, setCourses] = useState<ComboOption[]>([]);
  const [years, setYears] = useState<ComboOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [courseSubjects, setCourseSubjects] = useState<any[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);


const isRegularSubject = (subject: any) => {
  // Check if subject type indicates lab, misc, or others
  if (subject.rateTypeCode === "2" || subject.rateTypeCode === "3" || subject.rateTypeCode === "4") {
    return false; // hide
  }
  
  // Filter based on description
  const desc = subject.rdDesc.toLowerCase();
  if (desc.includes("laboratory") || 
      desc.includes("misc") || desc.includes("others")) {
    return false;
  }
  return true; // show subjects
};


  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [coursesRes, yearsRes] = await Promise.all([
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`),
          axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListYear`),
        ]);
        
        setCourses(coursesRes.data.map((c: any) => ({
          label: c.courseDesc,
          value: c.courseCode,
        })));
        
        setYears(yearsRes.data.map((y: any) => ({
          label: y.yearDesc,
          value: y.yearCode,
        })));
      } catch (error) {
        toast.error("Error loading dropdowns");
        console.error(error);
      }
    }
    fetchDropdowns();
  }, []);

  useEffect(() => {
    // Don't try to load anything until both the student data and course/year lists are loaded
    if (!preselectedStudent || !courses.length || !years.length) return;
    
    const matchingCourse = courses.find(c => c.label === preselectedStudent.courseDesc);
    const matchingYear = years.find(y => y.label === preselectedStudent.yearDesc);
    
    if (!matchingCourse || !matchingYear) {
      console.log("Could not find matching course or year");
      return;
    }
    
    axios.get(`${plsConnect()}/api/Enrollment2/GetSubjectsByYearCourse/${matchingYear.value}/${matchingCourse.value}`)
      .then(response => {
        setCourseSubjects(response.data);
        setEditMode(false);
      })
      .catch(error => {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to fetch subjects for this student");
      });
      
  }, [preselectedStudent, courses, years]);



  useEffect(() => {
    async function fetchFilteredSubjects() {
      if (selectedYear && selectedCourse) {
        try {
          const response = await axios.get(
            `${plsConnect()}/api/Enrollment2/GetSubjectsByYearCourse/${selectedYear}/${selectedCourse}`
          );
          
          // Filter existing subjects in list
          const existingPKRates = courseSubjects.map(s => s.pkRate);
          const newSubjects = response.data.filter(
            (subject: any) => !existingPKRates.includes(subject.pkRate)
          );
          
          setFilteredSubjects(newSubjects);
        } catch (error) {
          toast.error("Failed to fetch additional subjects");
          console.error(error);
        }
      } else {
        setFilteredSubjects([]);
      }
    }
    fetchFilteredSubjects();
  }, [selectedYear, selectedCourse, courseSubjects]);

  const handleRemoveSubject = (index: number) => {
    setCourseSubjects(prevSubjects => 
      prevSubjects.filter((_, idx) => idx !== index)
    );
    toast.info("Subject removed");
  };


  const handleAddSubject = (subject: any) => {
    // Check if subject is already in the list
    const isAlreadyAdded = courseSubjects.some(s => s.pkRate === subject.pkRate);
    
    if (isAlreadyAdded) {
      toast.error("This subject is already in your list");
      return;
    }
    
    setCourseSubjects(prev => [...prev, subject]);
    toast.success(`Added ${subject.rdDesc}`);
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const onSubmit = async () => {
    if (courseSubjects.length === 0) {
      toast.error("No subjects available for enrollment");
      return;
    }


    const rows = courseSubjects.map((subject, index) => ({
      rowNum: index + 1,
      subjectCode: subject.rdCode,
      PKRate: subject.pkRate,
      professorCode: "00000", // Default value
      roomCode: "000", 
      scheduleDayCode: "00", 
      classStart: "00:00", 
      classEnd: "00:00", 
      noUnits: subject.noUnits,
      rateAmount: subject.rateAmount,
      amount: subject.noUnits === 0 ? subject.rateAmount : subject.noUnits * subject.rateAmount,
      rateTypeCode: subject.rateTypeCode,
    }));

    const payload = {
      pkCode: preselectedStudent.pkCode,
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* STUDENT INFO DISPLAY */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student</h3>
                  <p className="text-lg font-medium">{preselectedStudent.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Section</h3>
                  <p className="text-lg font-medium">{preselectedStudent.sectionDesc}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Course</h3>
                  <p className="text-lg font-medium">{preselectedStudent.courseDesc}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Year</h3>
                  <p className="text-lg font-medium">{preselectedStudent.yearDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SUBJECTS TO BE ADDED */}
          {courseSubjects.length > 0 && (
            <div className="border rounded-lg p-4">
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
                      {editMode && <th className="py-2 px-4 text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {courseSubjects.filter(subject => isRegularSubject(subject))
                    .map((subject, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{subject.rdDesc}</td>
                        <td className="py-2 px-4 text-right">{subject.noUnits}</td>
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
                      {editMode && <td className="py-2 px-4"></td>}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          
          {/* ADDITIONAL SUBJECTS SECTION */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Add Additional Subjects</h3>
            
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
            
            {/* ADDITIONAL SUBJECTS */}
            {filteredSubjects.length > 0 ? (
              <div className="border rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium mb-2">Available Additional Subjects ({filteredSubjects.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-sm">
                        <th className="py-2 px-4 text-left">Subject</th>
                        <th className="py-2 px-4 text-right">Units</th>
                        <th className="py-2 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.filter(subject => isRegularSubject(subject))
                     .map((subject, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 text-sm">
                          <td className="py-2 px-4">{subject.rdDesc}</td>
                          <td className="py-2 px-4 text-right">{subject.noUnits}</td>
                          <td className="py-2 px-4 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddSubject(subject)}
                              className="text-blue-500 hover:bg-blue-50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : selectedYear && selectedCourse ? (
              <div className="text-center py-4 text-gray-500">
                No additional subjects available for this course and year.
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Select a course and year to see available subjects.
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <Button 
              type="submit" 
              className="float-right"
              disabled={courseSubjects.length === 0 || editMode}
            >
              Submit Enrollment
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}