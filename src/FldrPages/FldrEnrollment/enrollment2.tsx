import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { Enrollment2Table } from "@/components/FldrDatatable/enrollment2-columns"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Enrollment2Col } from "@/FldrTypes/types"

export default function Enrollment2() {
  const [allStudents, setAllStudents] = useState<Enrollment2Col[]>([]);
  const [studentsWithSubjects, setStudentsWithSubjects] = useState<Enrollment2Col[]>([]);
  const [studentsWithoutSubjects, setStudentsWithoutSubjects] = useState<Enrollment2Col[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Get all enrolled students
      const studentsResponse = await axios.get(
        `${plsConnect()}/api/Enrollment2/ListEnrollment2Student`
      );
      
      // Format student names
      const students = studentsResponse.data.map((item: Enrollment2Col) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
      }));
      
      setAllStudents(students);
      
      // Get all enrollment details to filter students with subjects
      const enrollmentsResponse = await axios.get(
        `${plsConnect()}/api/Enrollment2/AllData`
      );
      
      const enrollments = enrollmentsResponse.data;
      
      // Get unique PKCodes that have enrollments
      const studentsWithEnrollments = new Set();
      enrollments.forEach((enrollment: Enrollment2Col) => {
        studentsWithEnrollments.add(enrollment.pkCode);
      });
      
      // Filter students with and without subjects
      const withSubjects = students.filter((student: Enrollment2Col) => 
        studentsWithEnrollments.has(student.pkCode)
      );
      
      const withoutSubjects = students.filter((student: Enrollment2Col) => 
        !studentsWithEnrollments.has(student.pkCode)
      );
      
      setStudentsWithSubjects(withSubjects);
      setStudentsWithoutSubjects(withoutSubjects);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <div className="container py-6">
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All Students
                {allStudents.length > 0 && (
                  <Badge className="ml-2 bg-gray-200 text-gray-700">
                    {allStudents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="no-subjects">
                No Subjects
                {studentsWithoutSubjects.length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700">
                    {studentsWithoutSubjects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="with-subjects">
                With Subjects
                {studentsWithSubjects.length > 0 && (
                  <Badge className="ml-2 bg-green-100 text-green-700">
                    {studentsWithSubjects.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {/* <DataTable
                columns={columnsEnrolled}
                data={allStudents}
                title="Students"
                loading={isLoading}
                onRefresh={fetchStudents}
              /> */}
              <Enrollment2Table data={allStudents} loading={isLoading} onRefresh={()=>allStudents} />
            </TabsContent>
            
            <TabsContent value="no-subjects" className="mt-4">
              {/* <DataTable
                columns={columnsEnrolled}
                data={studentsWithoutSubjects}
                title="Students Without Subjects"
                loading={isLoading}
                onRefresh={fetchStudents}
              /> */}
              <Enrollment2Table data={studentsWithoutSubjects} loading={isLoading} onRefresh={()=>studentsWithoutSubjects} />
            </TabsContent>
            
            <TabsContent value="with-subjects" className="mt-4">
              {/* <DataTable
                columns={columnsEnrolled}
                data={studentsWithSubjects}
                title="Students With Subjects"
                loading={isLoading}
                onRefresh={fetchStudents}
              /> */}
              <Enrollment2Table data={studentsWithSubjects} loading={isLoading} onRefresh={()=>studentsWithSubjects} />
            </TabsContent>
          </Tabs>
        </div>

        <Toaster />
      </div>
    </>
  )
}