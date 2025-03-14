import { columns } from "@/components/FldrDatatable/course-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { CourseForm } from "@/components/FldrForm/entrycourse"
import { CourseCol } from "@/FldrTypes/course.col";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Course() {
  const [data, setData] = useState<CourseCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)


  const getCourse = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      getCourse()
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Add new course
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-lg font-medium">Add new course</DialogTitle>
          <CourseForm />
        </DialogContent>
      </Dialog>
      <div className="mt-4">
        <DataTable columns={columns} data={data} loading={loading} title="courses" />
      </div>
      <Toaster />
    </>
  )
}
