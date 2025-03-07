import { StudentForm } from "@/components/FldrForm/entrystudent"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { StudentCol, columns } from "@/components/FldrDatatable/student";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios";


export default function Student() {
  const [data, setData] = useState<StudentCol[]>([]);

  useEffect(() => {
    axios
      .get<StudentCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListStudent`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
    <ScrollArea className="mt-4 overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
          <DataTable columns={columns} data={data} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

    <Toaster />
    </>
  )
}
