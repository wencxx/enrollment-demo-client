import { columns } from "@/components/FldrDatatable/section-col.tsx";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { SectionForm } from "@/components/FldrForm/entrySection"
import { SectionCol } from "@/FldrTypes/section";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'

export default function Section() {
  const [data, setData] = useState<SectionCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSections = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListSection`)
      
      const formattedData = res.data.map((item: any, index: number) => ({
        fieldNumber: index + 1,
        sectionCode: item.sectionCode || item.sectionCode,
        sectionDesc: item.sectionDesc || item.sectionDesc,
      }));
      
      setData(formattedData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getSections()
  }, []);

  return (
    <div className="container py-6">
        <div className="space-x-2">
          {/* <h2 className="text-xl font-semibold">Courses</h2> */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <SectionForm
                onCancel={getSections}
                onSuccess={() => {
                  getSections();
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
            title="sections" 
            onRefresh={getSections}
          />
        </div>
      <Toaster />
    </div>
  )
}
