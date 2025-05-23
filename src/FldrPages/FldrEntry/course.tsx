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

export default function Course() {
  const [data, setData] = useState<CourseCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getCourse = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListCourse`)
      
      const formattedData = res.data.map((item: any) => ({
        courseCode: item.courseCode,
        courseDesc: item.courseDesc,  
        collegeCode: item.collegeCode,
        collegeDesc: item.collegeDesc
      }));
      
      setData(formattedData)
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
    <div className="container py-6">
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add new course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CourseForm onCancel={getCourse} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <DataTable 
            columns={columns} 
            data={data} 
            loading={loading} 
            title="courses" 
            onRefresh={getCourse}
          />
        </div>
      <Toaster />
    </div>
  )
}
