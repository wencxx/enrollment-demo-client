import { Rate2Table } from "@/components/FldrDatatable/rate2-col.tsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { Rate2Col } from "@/FldrTypes/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { EntryRate2Form } from "@/components/FldrForm/entryRate2";

type Rate2ApiResponse = {
  pkRate?: string;
  yearDesc?: string;
  courseDesc?: string;
  rdDesc?: string;
  rateTypeDesc?: string;
  rateSubTypeDesc?: string;
  semDesc?: string;
};

export default function Rate2() {
  const [data, setData] = useState<Rate2Col[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRate2 = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/ListRate2`)
      
      const formattedData = res.data.map((item: Rate2ApiResponse) => ({
        pkRate: item.pkRate || "",
        yearDesc: item.yearDesc || "",
        courseDesc: item.courseDesc || "",
        semDesc: item.semDesc || "",
        rdDesc: item.rdDesc || "",
        rateTypeDesc: item.rateTypeDesc || "",
        rateSubTypeDesc: item.rateSubTypeDesc || "",
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
            <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[90dvw] lg:!max-w-[80dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogTitle>Insert Rates</DialogTitle>
                <div className="w-full overflow-x-auto">
                <EntryRate2Form
                onCancel={getRate2}
                onSuccess={() => {
                    getRate2();
                    setIsDialogOpen(false);
                }}
                />
                </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <Rate2Table data={data} loading={loading} onRefresh={getRate2} />
        </div>
      <Toaster />
    </div>
  )
}
