import { columns } from "@/components/FldrDatatable/ratedesc-col.tsx";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { RateDescForm } from "@/components/FldrForm/entryratedesc";
import { RateDescCol } from "@/FldrTypes/ratedesc";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'

export default function RateDesc() {
  const [data, setData] = useState<RateDescCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRateDesc = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/ListRateDesc`)
      
      const formattedData = res.data.map((item: any, index: number) => ({
        fieldNumber: index + 1,
        RDID: item.RDID ?? item.rdid,     
        RDDesc: item.RDDesc ?? item.rdDesc 
      }));
      console.log("RateDesc data:", formattedData)
      setData(formattedData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getRateDesc()
  }, []);

  return (
    <div className="container py-6">
        <div className="space-x-2">
          {/* <h2 className="text-xl font-semibold">Courses</h2> */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new rate description
              </Button>
            </DialogTrigger>
            <DialogContent>
              <RateDescForm
                onCancel={getRateDesc}
                onSuccess={() => {
                    getRateDesc();
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
            title="rate descriptions" 
            onRefresh={getRateDesc}
          />
        </div>
      <Toaster />
    </div>
  )
}
