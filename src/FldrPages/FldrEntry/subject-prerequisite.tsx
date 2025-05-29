import { useState, useEffect } from "react";
import axios from "axios";
import { CourseForm } from "@/components/FldrForm/entrycourse"
import { SubjectCol } from "@/FldrTypes/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { SubjectTable } from "@/components/FldrDatatable/subject-columns";
import { SubjectForm } from "@/components/FldrForm/entrysubject";

export default function Subject() {
  const [data, setData] = useState<SubjectCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/ListRateDesc`)
      
      const formattedData = res.data.map((item: SubjectCol) => ({
        rdCode: item.rdCode,
        rdid: item.rdid,  
        rdDesc: item.rdDesc,
      }));

      console.log(formattedData)
      
      setData(formattedData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getData()
  }, []);

  return (
    <div className="container py-6">
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add new subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <SubjectForm onCancel={getData} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <SubjectTable data={data} loading={loading} onRefresh={getData} />
        </div>
      <Toaster />
    </div>
  )
}
