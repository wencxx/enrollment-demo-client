import { StudentForm } from "@/components/FldrForm/entrystudent"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columns } from "@/components/FldrDatatable/student-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios";
import { StudentCol, StudentColFullName } from "@/FldrTypes/students-col"
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";
import { PendingApplicantCol } from "@/FldrTypes/pendingapplicant";
import { columnsPending } from "@/components/FldrDatatable/pendingapplicant-columns"
// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Student() {
  const [data, setData] = useState<StudentColFullName[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getStudents = async () => {
    try {
      setLoading(true)
      const res = await axios.get<StudentCol[]>(`${plsConnect()}/API/WEBAPI/StudentController/ListStudent`)

      const dataWithFullName = res.data.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`
      }));

      setData(dataWithFullName);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getStudents()
  }, []);

  // students who are not yet "approved" (EnrollStatusCode = 1 "Pending"), meaning they are new to the school
  const [pending, setPending] = useState<PendingApplicantCol[]>([]);
  
    const fetchPending = async () => {
      try {
        setLoading(true)
        const response = await axios.get<PendingApplicantCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`);
        const updatedData = response.data.map((item) => ({
          ...item,
          fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
        }));
        setPending(updatedData);
        console.log(updatedData)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false)
      }
    };
  
    useEffect(() => {
      fetchPending();
    }, []);

  // print function
  // const contentRef = useRef<HTMLDivElement>(null);
  // const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
    <Tabs defaultValue="students" className="w-full">
      <TabsList>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="pendingStudents">Pending Applicants</TabsTrigger>
      </TabsList>
      <TabsContent value="students">
      <DataTable columns={columns} data={data} title="students" loading={loading} />
      </TabsContent>
      <TabsContent value="pendingStudents">
      <DataTable columns={columnsPending} data={pending} loading={loading} title="pending students" />
      </TabsContent>
    </Tabs>

    {/* <div className="hidden print:block" ref={contentRef}>this is the content to print</div> */}
    <Toaster />
    </>
  )
}
