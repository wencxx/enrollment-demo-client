import { columns } from "@/components/FldrDatatable/rate2-col.tsx";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { Rate2Col } from "@/FldrTypes/kim-types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { EntryRate2Form } from "@/components/FldrForm/entryRate2";

export default function Rate2() {
  const [data, setData] = useState<Rate2Col[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRate2 = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/ListRate2`)
      
      const formattedData = res.data.map((item: any, index: number) => ({
        fieldNumber: index + 1,
        pkRate: item.pkRate || "",
        yearDesc: item.yearDesc || "",
        courseDesc: item.courseDesc || "",
        rdDesc: item.rdDesc || "",
        rateTypeDesc: item.rateTypeDesc || "",
      }));
      console.log("List received:", res.data);  
      setData(formattedData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getRate2()
  }, []);

  return (
    <div className="container py-6">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new Rate 2
              </Button>
            </DialogTrigger>
            <DialogContent>
                <EntryRate2Form
                onCancel={getRate2}
                onSuccess={() => {
                    getRate2();
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
            title="rooms" 
            onRefresh={getRate2}
          />
        </div>
      <Toaster />
    </div>
  )
}
