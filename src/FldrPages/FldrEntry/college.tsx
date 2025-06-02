import { columns } from "@/components/FldrDatatable/college-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { CollegeForm } from "@/components/FldrForm/entrycollege.tsx";
import { CollegeCol } from "@/FldrTypes/kim-types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'

export default function College() {
  const [data, setData] = useState<CollegeCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListCollege`)
      
      const formattedData = res.data.map((item: any, index: number) => ({
        fieldNumber: index + 1,
        collegeCode: item.collegeCode || "",
        collegeDesc: item.collegeDesc || "",
      }));
      
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
          {/* <h2 className="text-xl font-semibold">Courses</h2> */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new college
              </Button>
            </DialogTrigger>
            <DialogContent>
                <CollegeForm
                onCancel={getData}
                onSuccess={() => {
                    getData();
                    setIsDialogOpen(false);
                }}
                />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <DataTable 
            columns={columns} 
            data={data} 
            loading={loading} 
            title="colleges" 
            onRefresh={getData}
          />
        </div>
      <Toaster />
    </div>
  )
}
