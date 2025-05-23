"use client";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

type Subject = {
  pkRate: string;
  rdCode: string;
  rdDesc: string;
  academicUnits: number;
  labUnits: number;
  rateAmount: number;
  rateTypeCode: string;
};

type Enrollment = {
  pkCode: string;
  rowNum: number;
  pkRate: string;
  PKRate?: string;
  amount: number;
  professorCode: string;
  academicUnits: number;
  labUnits: number;
  rdDesc?: string;
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

  const { handleSubmit } = form;

  const [courses, setCourses] = useState<ComboOption[]>([]);
  const [years, setYears] = useState<ComboOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [courseSubjects, setCourseSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentEnrollments, setCurrentEnrollments] = useState<Enrollment[]>([]);
  const [loadingCurrentSubjects, setLoadingCurrentSubjects] = useState(false);
  const [enrolledPkRates, setEnrolledPkRates] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<Enrollment | null>(null);
  const [deletingEnrollment, setDeletingEnrollment] = useState(false);

  const isRegularSubject = (subject: any) => {
    if (!subject) return false;
    
    if (subject.rateTypeCode === "2" || subject.rateTypeCode === "3" || subject.rateTypeCode === "4") {
      return false;
    }
    
    const desc = (subject.rdDesc || "").toLowerCase();
    return !desc.includes("laboratory") && !desc.includes("misc") && !desc.includes("others");
  };

  // Memoized filtered lists
  const regularCurrentEnrollments = useMemo(() => 
    currentEnrollments.filter(isRegularSubject), 
    [currentEnrollments]
  );
  
  const availableCourseSubjects = useMemo(() => 
    courseSubjects.filter(isRegularSubject),
    [courseSubjects]
  );
  
  const availableFilteredSubjects = useMemo(() => 
    filteredSubjects.filter(isRegularSubject).filter(
      subject => !courseSubjects.some(cs => cs.pkRate === subject.pkRate)
    ),
    [filteredSubjects, courseSubjects]
  );

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

  // Load student's current subjects
  useEffect(() => {
    if (!preselectedStudent?.pkCode) return;
    
    async function fetchCurrentEnrollments() {
      setLoadingCurrentSubjects(true);
      try {
        const response = await axios.get(
          `${plsConnect()}/api/Enrollment2/AllData?pkCode=${preselectedStudent.pkCode}`
        );
        
        const studentEnrollments = response.data.filter((item: any) => 
          item.pkCode === preselectedStudent.pkCode
        );
        
        setCurrentEnrollments(studentEnrollments);
        
        // Create a Set of enrolled PKRates for quick lookup
        const pkRatesSet = new Set();
        studentEnrollments.forEach((enrollment: any) => {
          if (enrollment.pkRate) {
            pkRatesSet.add(String(enrollment.pkRate).trim());
          }
          if (enrollment.PKRate) {
            pkRatesSet.add(String(enrollment.PKRate).trim());
          }
        });
        setEnrolledPkRates(pkRatesSet);
        
      } catch (error) {
        console.error("Error fetching current enrollments:", error);
        toast.error("Failed to load current subjects");
      } finally {
        setLoadingCurrentSubjects(false);
      }
    }
    
    fetchCurrentEnrollments();
  }, [preselectedStudent]);

  useEffect(() => {
    if (!preselectedStudent || !courses.length || !years.length || !enrolledPkRates) return;
    
    const matchingCourse = courses.find(c => c.label === preselectedStudent.courseDesc);
    const matchingYear = years.find(y => y.label === preselectedStudent.yearDesc);
    
    if (!matchingCourse || !matchingYear) return;
    
    axios.get(`${plsConnect()}/api/Enrollment2/GetSubjectsByYearCourse/${matchingYear.value}/${matchingCourse.value}`)
      .then(response => {
        // Filter out subjects that are already enrolled
        const filteredSubjects = response.data.filter((subject: Subject) => {
          const normalizedPkRate = String(subject.pkRate).trim();
          return !enrolledPkRates.has(normalizedPkRate);
        });
        
        setCourseSubjects(filteredSubjects);
        setEditMode(false);
      })
      .catch(error => {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to fetch subjects for this student");
      });
  }, [preselectedStudent, courses, years, enrolledPkRates]);

  useEffect(() => {
    if (!selectedYear || !selectedCourse || !enrolledPkRates) {
      setFilteredSubjects([]);
      return;
    }
    
    async function fetchFilteredSubjects() {
      try {
        const response = await axios.get(
          `${plsConnect()}/api/Enrollment2/GetSubjectsByYearCourse/${selectedYear}/${selectedCourse}`
        );
        
        // Filter out subjects that are already enrolled
        const availableSubjects = response.data.filter((subject: Subject) => {
          const normalizedPkRate = String(subject.pkRate).trim();
          return !enrolledPkRates.has(normalizedPkRate);
        });
        
        setFilteredSubjects(availableSubjects);
      } catch (error) {
        toast.error("Failed to fetch additional subjects");
      }
    }
    
    fetchFilteredSubjects();
  }, [selectedYear, selectedCourse, enrolledPkRates]);

  const handleRemoveSubject = (index: number) => {
    setCourseSubjects(prev => prev.filter((_, idx) => idx !== index));
    toast.info("Subject removed");
  };

  const handleAddSubject = (subject: Subject) => {
    // Check for duplicates
    if (courseSubjects.some(s => s.pkRate === subject.pkRate)) {
      toast.error("This subject is already in your list");
      return;
    }
    
    // Check if already enrolled
    if (enrolledPkRates.has(String(subject.pkRate).trim())) {
      toast.error(`Student is already enrolled in ${subject.rdDesc}`);
      return;
    }
    
    setCourseSubjects(prev => [...prev, subject]);
    toast.success(`Added ${subject.rdDesc}`);
  };

  const toggleEditMode = () => setEditMode(prev => !prev);

  const getTotalUnits = (subject: { academicUnits?: number; labUnits?: number }) =>
  (subject.academicUnits || 0) + (subject.labUnits || 0);

  const onSubmit = async () => {
    if (courseSubjects.length === 0) {
      toast.error("No subjects selected for enrollment");
      return;
    }

    const rows = courseSubjects.map((subject, index) => ({
      rowNum: index + 1,
      subjectCode: subject.rdCode,
      PKRate: subject.pkRate,
      professorCode: "00000",
      roomCode: "000",
      scheduleDayCode: "00",
      classStart: "00:00",
      classEnd: "00:00",
      academicUnits: subject.academicUnits,
      labUnits: subject.labUnits,
      rateAmount: subject.rateAmount,
      amount: subject.rateAmount,
      rateTypeCode: subject.rateTypeCode,
    }));

    try {
      await axios.post(
        `${plsConnect()}/api/Enrollment2/AddEnrollment2`,
        { pkCode: preselectedStudent.pkCode, rows }
      );
      onSubmitSuccess();
      onAddRate();
      toast.success(`Successfully enrolled with ${rows.length} subjects!`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Entry already exists.")
        } else {
          toast.error(error.response?.data?.message || "Error submitting form.");
        }
      }
    }
  };

  const confirmDeleteEnrollment = (enrollment: Enrollment) => {
    setEnrollmentToDelete(enrollment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEnrollment = async () => {
    if (!enrollmentToDelete) {
      setDeleteDialogOpen(false);
      return;
    }


    setDeletingEnrollment(true);
    try {
      await axios.post(`${plsConnect()}/api/Enrollment2/DeleteEnrollment2`, {
        pkCode: preselectedStudent.pkCode,
        pkRate: enrollmentToDelete.pkRate || enrollmentToDelete.PKRate
      });

      setCurrentEnrollments(prev => 
        prev.filter(e => (e.pkRate || e.PKRate) !== (enrollmentToDelete.pkRate || enrollmentToDelete.PKRate))
      );

      // Update the enrolledPkRates set
      setEnrolledPkRates(prev => {
        const newSet = new Set(prev);
        const pkRateToDelete = String(enrollmentToDelete.pkRate || enrollmentToDelete.PKRate).trim();
        newSet.delete(pkRateToDelete);
        return newSet;
      });

      toast.success(`Removed ${enrollmentToDelete.rdDesc || "subject"} from subject load.`);
      
      // Refresh course subjects
      if (preselectedStudent && courses.length && years.length) {
        const matchingCourse = courses.find(c => c.label === preselectedStudent.courseDesc);
        const matchingYear = years.find(y => y.label === preselectedStudent.yearDesc);
        
        if (matchingCourse && matchingYear) {
          const response = await axios.get(
            `${plsConnect()}/api/Enrollment2/GetSubjectsByYearCourse/${matchingYear.value}/${matchingCourse.value}`
          );
          
          // Find the deleted subject
          const deletedSubject = response.data.find((subject: Subject) => 
            String(subject.pkRate).trim() === String(enrollmentToDelete.pkRate || enrollmentToDelete.PKRate).trim()
          );
          
          if (deletedSubject) {
            setCourseSubjects(prev => [...prev, deletedSubject]);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error("Failed to delete enrollment");
    } finally {
      setDeletingEnrollment(false);
      setDeleteDialogOpen(false);
      setEnrollmentToDelete(null);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Student info */}
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Student Information
                </h3>
              </div>
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
          
          {/* Currently enrolled subjects */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Currently Enrolled Subjects
                </h3>
                {regularCurrentEnrollments.length > 0 && (
                  <Badge variant="outline" className="bg-blue-50">
                    {regularCurrentEnrollments.length} {regularCurrentEnrollments.length === 1 ? 'Subject' : 'Subjects'}
                  </Badge>
                )}
              </div>
              
              {loadingCurrentSubjects ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading current subjects...</p>
                </div>
              ) : regularCurrentEnrollments.length > 0 ? (
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
                      {regularCurrentEnrollments.map((enrollment, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 text-sm">
                          <td className="py-2 px-4">
                            {enrollment.rdDesc || "Subject"}
                          </td>
                          <td className="py-2 px-4 text-right">
                            {/* {enrollment.noUnits || 0} */}
                            {getTotalUnits(enrollment)}
                          </td>
                          <td className="py-2 px-4 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDeleteEnrollment(enrollment)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td className="py-2 px-4">Total</td>
                        <td className="py-2 px-4 text-right">
                          {regularCurrentEnrollments.reduce((sum, e) => sum + getTotalUnits(e), 0)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Student is not currently enrolled in any subjects.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Required subjects - only show if there are available subjects */}
          {availableCourseSubjects.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    Subjects To Be Loaded
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50">
                      {availableCourseSubjects.length} Subjects
                    </Badge>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleEditMode}
                    >
                      {editMode ? "Done" : "Edit"}
                    </Button>
                  </div>
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
                      {availableCourseSubjects.map((subject, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{subject.rdDesc}</td>
                          <td className="py-2 px-4 text-right">{getTotalUnits(subject)}</td>
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
                          {availableCourseSubjects.reduce((sum, s) => sum + getTotalUnits(s), 0)}
                        </td>
                        {editMode && <td className="py-2 px-4"></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Additional subjects */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Add Additional Subjects
                </h3>
              </div>
              
              {/* Year and Course selection */}
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
                                onSelect={() => setSelectedYear(year.value)}
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
                                onSelect={() => setSelectedCourse(course.value)}
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
              
              {/* Available additional subjects */}
              {availableFilteredSubjects.length > 0 ? (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Available Additional Subjects</h3>
                    <Badge variant="outline" className="bg-purple-50">
                      {availableFilteredSubjects.length} Subjects
                    </Badge>
                  </div>
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
                        {availableFilteredSubjects.map((subject, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50 text-sm">
                            <td className="py-2 px-4">{subject.rdDesc}</td>
                            <td className="py-2 px-4 text-right">{getTotalUnits(subject)}</td>
                            <td className="py-2 px-4 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddSubject(subject)}
                                className="text-blue-500 hover:bg-blue-50"
                              >
                                +
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedYear && selectedCourse ? (
                <div className="text-center py-6 border rounded-lg">
                  <div className="text-gray-500">
                    No additional subjects available for this course and year.
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-lg">
                  <div className="text-gray-500">
                    Select a course and year to see available subjects.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="px-8"
              disabled={availableCourseSubjects.length === 0 || editMode}
            >
              Submit Enrollment
            </Button>
          </div>
        </form>
      </Form>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {enrollmentToDelete?.rdDesc || "this subject"} from the student's enrollment?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingEnrollment}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEnrollment}
              disabled={deletingEnrollment}
              className="bg-red-500 hover:bg-red-600"
            >
              {deletingEnrollment ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}