import { CourseCol, columns } from "@/components/FldrDatatable/course";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { CourseForm } from "@/components/FldrForm/entrycourse"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";

export default function Course() {
  const [data, setData] = useState<CourseCol[]>([]);

  useEffect(() => {
    axios
      .get<CourseCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // const options = {
  //   filterBy: 'status'
  // }
  return (
    <>
    <Dialog>
        <DialogTrigger>
        <Button variant="outline">Add new course</Button>
        </DialogTrigger>
        <DialogContent>
          <CourseForm />
        </DialogContent>
    </Dialog>
    <div className="mt-4">
      <DataTable columns={columns} data={data} />
    </div>
    <Toaster />
    </>
  )
}
