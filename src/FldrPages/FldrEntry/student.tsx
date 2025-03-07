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
import { StudentCol } from "@/FldrTypes/students-col"

export default function Student() {
  const [data, setData] = useState<StudentCol[]>([]);

  const getStudents =  async () => {
    try {
      const res = await axios.get<StudentCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListStudent`)

      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getStudents()
  }, []);

  const addNewStudent = (newStudent: StudentCol) => {
    setData((prevData) => [...prevData, newStudent])
  }

  return (
    <>
    <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add new student</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
          <StudentForm onSubmitSuccess={addNewStudent} />
        </DialogContent>
    </Dialog>
    <DataTable columns={columns} data={data} /> 
    <Toaster />
    </>
  )
}
