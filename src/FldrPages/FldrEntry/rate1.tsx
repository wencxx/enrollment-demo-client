import { Rate1Table } from "@/components/FldrDatatable/rate1-col.tsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { Rate1Col } from "@/FldrTypes/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { EntryRate1Form } from "@/components/FldrForm/entryRate1";

export default function Rate1() {
  const [data, setData] = useState<Rate1Col[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRate1 = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/ListRate1`)
      
      const formattedData = res.data.map((item: Rate1Col) => ({
        pkRate1: item.pkRate1 || "",
        yearCode: item.yearCode || "",
        courseCode: item.courseCode || "",
        yearDesc: item.yearDesc || "",
        courseDesc: item.courseDesc || "",
        semCode: item.semCode || "",
        semDesc: item.semDesc || "",
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
    getRate1()
  }, []);

  return (
    <div className="container py-6">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new Rate 1
              </Button>
            </DialogTrigger>
            <DialogContent>
                <EntryRate1Form
                onCancel={getRate1}
                onSuccess={() => {
                    getRate1();
                    setIsDialogOpen(false);
                }}
                />
            </DialogContent>
          </Dialog>
        <div className="mt-4">
          <Rate1Table data={data} loading={loading} onRefresh={getRate1} />
        </div>
      <Toaster />
      </div>
    </div>
  )
}
