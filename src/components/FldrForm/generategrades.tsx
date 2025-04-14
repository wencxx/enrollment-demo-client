import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ListRestart } from "lucide-react";
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
import { AcademicYear } from "@/FldrTypes/academic-year";
import useAuthStore from "@/FldrStore/auth";

type GradeFormData = {
    pkCode: string;
    userCode: string;
};

interface GradeFormProps {
    studentCode: string;
}

export const GenerateGrades =  ({ studentCode }: GradeFormProps) => {
    const { currentUser } = useAuthStore.getState();

    useEffect(() => {
        console.log("USER:", currentUser?.userCode)
    }, []);
    
    const form = useForm<GradeFormData>({
        defaultValues: {
            pkCode: "",
            userCode: currentUser?.userCode,
        },
    });
    
      
    const [loading, setLoading] = useState<boolean>(false)
    const [acadYears, setAcadYears] = useState<AcademicYear[]>([])
    const [aYearCode, setSelectedAYearCode] = useState<string | null>(null);
    const [semesters, setSemesters] = useState<any[]>([]);
    const [pkCode, setSelectedSemester] = useState<string | null>(null);

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
            } catch (error: any) {
            console.error("Error fetching semesters:", error);
            } finally {
            setLoading(false);
            }
        }

    fetchSemesters();
    }, [aYearCode]);

    useEffect(() => {
        console.log("Current PKCode:", pkCode);
    }, [pkCode]);
    
    // wrap in try catch also account for conflict error
    const onSubmit = async (data: GradeFormData) => {
        try {
            console.log("Submitted:", data);
            const response = await axios.post(`${plsConnect()}/GradesController/ProcessEnrollment`, data);
            console.log("Response:", response);
            toast("Grades generated successfully.");
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 409) {
                    const errorMessage = error.response.data || "Enrollment can only be loaded once.";
                    toast.error(errorMessage);
                } else if (error.response.status === 404) {
                    const errorMessage = error.response.data || "No load; proceed to Enrollment2 first.";
                    toast.error(errorMessage);
                }
            } else {
                toast.error("Network error or unexpected issue.");
                console.error("Error:", error);
            }
        }
    }

      if (!currentUser) {
        toast("User not logged in.");
        return;
      }
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
                       name="pkCode"
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
               
               {pkCode ? (
               <div className="flex flex-col items-center space-x-2">
                    <Button type="submit">
                    <ListRestart />
                    Generate Grades
                    </Button>
               </div>) : (
                   <div className="flex justify-end space-x-2">
                   </div>
               )}
                </form>
            </Form>
        </>
    );
}
