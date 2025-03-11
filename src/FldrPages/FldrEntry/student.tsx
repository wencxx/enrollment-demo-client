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
// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";

export default function Student() {
  const [data, setData] = useState<StudentColFullName[]>([]);

  const getStudents = async () => {
    try {
      const res = await axios.get<StudentCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListStudent`)

      const dataWithFullName = res.data.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`
      }));

      setData(dataWithFullName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getStudents()
  }, []);

  const addNewStudent = (newStudent: StudentColFullName) => {
    setData((prevData) => [...prevData, newStudent])
  }

  // print function
  // const contentRef = useRef<HTMLDivElement>(null);
  // const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
              Add new student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
            <StudentForm onSubmitSuccess={addNewStudent} />
          </DialogContent>
        </Dialog>
        {/* <Button variant="outline" onClick={() => reactToPrintFn()}>
          Print
        </Button> */}
      </div>
      <DataTable columns={columns} data={data} />
      {/* <div className="hidden print:block" ref={contentRef}>this is the content to print</div> */}
      <Toaster />
    </>
  )
}
