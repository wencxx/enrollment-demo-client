import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { gradeEditSchema } from "@/FldrSchema/userSchema";
import { AcademicYear } from "@/FldrTypes/academic-year";
import { GradesCol, SubjectStatus } from "@/FldrTypes/grades";
import Subject from "@/FldrPages/FldrEntry/subject-prerequisite";

type GradeFormData = z.infer<typeof gradeEditSchema> & {
    firstName: string;
    // etc
};

interface GradeFormProps {
    studentCode: string;
}

export const EditGrades =  ({ studentCode }: GradeFormProps) => {
    const form = useForm<GradeFormData>({
        resolver: zodResolver(gradeEditSchema),
    });

    const [loading, setLoading] = useState<boolean>(false)
    const [acadYears, setAcadYears] = useState<AcademicYear[]>([])
    const [aYearCode, setSelectedAYearCode] = useState<string | null>(null);
    const [semesters, setSemesters] = useState<any[]>([]);
    const [pkCode, setSelectedSemester] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [originalGrades, setOriginalGrades] = useState<GradesCol[]>([]); 

    const [subjStatus, setSubjStatus] = useState<SubjectStatus[]>([]);

    async function fetchSubjectStatus() {
        if (!studentCode) return;
        try {
        console.log("Student to fetch years for: ", studentCode)
        setLoading(true);
        const response = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListSubjectStatus`)
        setSubjStatus(response.data)
        } catch (error: any) {
        console.error("Error fetching years:", error)
        }
    }
    useEffect(() => {
        fetchSubjectStatus();
    }, []); 

    async function fetchAcadYears() {
        if (!studentCode) return;
        try {
        console.log("Student to fetch years for: ", studentCode)
        setLoading(true);
        const response = await axios.get(`${plsConnect()}/GradesController/GetAcadYearActive/${studentCode}`)
        setAcadYears(response.data)
        } catch (error: any) {
        console.error("Error fetching years:", error)
        }
    }
    useEffect(() => {
        fetchAcadYears();
    }, [studentCode]); 

    useEffect(() => {
        if (!aYearCode) return;

        async function fetchSemesters() {
            try {
            setLoading(true);
            const response = await axios.get(`${plsConnect()}/GradesController/GetSemestersOfAY/${studentCode}/${aYearCode}`);
            setSemesters(response.data);
            console.log("Response:", response.data)
            } catch (error: any) {
            console.error("Error fetching semesters:", error);
            } finally {
            setLoading(false);
            }
        }

    fetchSemesters();
    }, [aYearCode]);

    const [grades, setGrades] = useState<GradesCol[]>([]);

    const [emptySem, setEmptySem] = useState("Please select a semester to view grades.");

    useEffect(() => {
        if (!pkCode) return;

        async function fetchGradesPerSem() {
            try {
            setLoading(true);
            const response = await axios.get<GradesCol[]>(`${plsConnect()}/GradesController/GetGradesPerSem/${pkCode}`);
            setGrades(response.data);
            console.log("Response:", response.data)
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.error("Not Found:", error.response.data);
                    setEmptySem("No subjects loaded for this semester.");
                    setSelectedSemester(null);
                  } else {
                    console.error("An error occurred:", error.message);
                  }
            } finally {
            setLoading(false);
            }
        }

        fetchGradesPerSem();
    }, [pkCode]);

    const onSubmit = async (values: GradeFormData) => {
        setIsEditing(false);
    }

    const handleEdit = () => {
        setOriginalGrades([...grades]);
        setIsEditing(true);
      };
    
      const handleCancel = () => {
        setGrades([...originalGrades]);
        setIsEditing(false);
      };
    
      // put async on this thing so you can use await in it
      const handleSave = async () => {
        const gradesToSave = grades.map((grade) => ({
          ...grade,
        // avg 0 if either value missing
          average:
            grade.midterm && grade.final
              ? (grade.midterm + grade.final) / 2 
              : 0.0, 
        }));
      
        console.log("Saving grades:", gradesToSave);
        setGrades(gradesToSave); 
        setIsEditing(false);
        try {
            for (const grade of gradesToSave) {
            await axios.put(
                `${plsConnect()}/GradesController/UpdateStudentGrade/${pkCode}/${grade.subjectCode}`,
                {
                Midterm: grade.midterm,
                Final: grade.final,
                Average: grade.average,
                SubjectStatusCode: grade.subjectStatusCode,
                }
            );
            }
        } catch (error: any){
            console.error("Error saving grades:", error);
            toast.error("Error saving grades.");
        }

        toast("Grades updated.");
      };
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   
                    {/* academic year */}
                    <FormField
                        control={form.control}
                        name="AYearCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedAYearCode(value); 
                                }} value={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a year">
                                {field.value
                                    ? (() => {
                                        const selectedYear = acadYears.find(
                                        (year) => String(year.aYearCode) === field.value
                                        );
                                        return selectedYear
                                        ? `${selectedYear.ayStart} - ${selectedYear.ayEnd}`
                                        : "Select a year";
                                    })()
                                    : "Select a year"}
                                </SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {acadYears.length > 0 ? (
                                acadYears.map((year) => (
                                    <SelectItem key={year.aYearCode} value={year.aYearCode}>
                                    {year.ayStart} - {year.ayEnd}
                                    </SelectItem>
                                ))
                                ) : (
                                <SelectItem disabled >No years available</SelectItem>
                                )}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* semester */}
                    <FormField
                        control={form.control}
                        name="PKCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Semester</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                const isValid = semesters.some((sem) => sem.pkCode === value);
                                if (isValid) {
                                    field.onChange(value);
                                    setSelectedSemester(value);
                                } else {
                                    field.onChange(null);
                                    setSelectedSemester(null);
                                }
                                }}
                                value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a year first">
                                {field.value
                                    ? (() => {
                                        const selectedSemester = semesters.find(
                                        (sem) => sem.pkCode === field.value
                                        );
                                        return selectedSemester
                                        ? selectedSemester.semDesc
                                        : "Select a semester";
                                    })()
                                    : "Select a year first"}
                                </SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {semesters.length > 0 ? (
                                semesters.map((sem) => (
                                <SelectItem key={sem.pkCode} value={sem.pkCode}>
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
                
                {/* Table */}
                {pkCode ? (
                <div className="col-span-full overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject Code</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Midterm</TableHead>
                            <TableHead>Final</TableHead>
                            <TableHead>Average</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades.length > 0 ? (
                        grades.map((grade, index) => (
                            <TableRow key={index}>
                                <TableCell>{grade.subjectCode}</TableCell>
                                <TableCell>{grade.noUnits}</TableCell>
                                <TableCell>
                                {isEditing ? (
                                    <Input
                                    type="number"
                                    step="0.01"
                                    defaultValue={grade.midterm}
                                    onChange={(e) => {
                                        const updatedGrades = [...grades];
                                        updatedGrades[index].midterm = parseFloat(e.target.value) || 0;
                                        setGrades(updatedGrades);
                                    }}
                                    />
                                ) : (
                                    grade.midterm
                                )}
                                </TableCell>
                                <TableCell>
                                {isEditing ? (
                                    <Input
                                    type="number"
                                    step="0.01"
                                    defaultValue={grade.final}
                                    onChange={(e) => {
                                        const updatedGrades = [...grades];
                                        updatedGrades[index].final = parseFloat(e.target.value) || 0;
                                        setGrades(updatedGrades);
                                    }}
                                    />
                                ) : (
                                    grade.final
                                )}
                                </TableCell>
                                <TableCell>{grade.average.toFixed(2)}</TableCell>
                                <TableCell>
                                {isEditing ? (
                                          <Select
                                          onValueChange={(value) => {
                                            setGrades((prevGrades) => {
                                              const updatedGrades = [...prevGrades];
                                              updatedGrades[index] = {
                                                ...updatedGrades[index],
                                                subjectStatusCode: value,
                                              };
                                              return updatedGrades;
                                            });
                                          }}
                                          value={grade.subjectStatusCode} 
                                        >
                                            <FormControl>
                                              <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Set status">
                                                {subjStatus.find((status) => status.subjectStatusCode === grade.subjectStatusCode)
                                                ?.subjectStatusDesc || "Set status"}
                                            </SelectValue>
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            {subjStatus.length > 0 ? (
                                            subjStatus.map((status) => (
                                                <SelectItem key={status.subjectStatusCode} value={status.subjectStatusCode}>
                                                {status.subjectStatusDesc}
                                                </SelectItem>
                                            ))
                                            ) : (
                                            <SelectItem disabled>N/A</SelectItem>
                                            )}
                                        </SelectContent>
                                          </Select>
                                    ) : (
                                        subjStatus.find((status) => status.subjectStatusCode === grade.subjectStatusCode)
                                        ?.subjectStatusDesc || "N/A"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                            No grades available.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                ) : (
                <div className="col-span-full text-center text-gray-300 mt-5">
                    {emptySem}
                </div>
                )}

                {pkCode ? (
                <div className="flex justify-end space-x-2">
                    {isEditing ? (
                    <>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                        </Button>
                        <Button type="button" onClick={handleSave}>
                        <Save />
                        Save
                        </Button>
                    </>
                    ) : (
                    <Button type="button" onClick={handleEdit}>
                        <Edit />
                        Edit
                    </Button>
                    )}
                </div>) : (
                    <div className="flex justify-end space-x-2"></div>
                )}
                </form>
            </Form>
        </>
    );
}