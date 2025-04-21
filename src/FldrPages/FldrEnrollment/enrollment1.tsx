import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { PendingApplicantCol } from "@/FldrTypes/pendingapplicant"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsPending } from "@/components/FldrDatatable/pendingapplicant-columns"
import { DataTable } from "@/components/FldrDatatable/data-table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Enrollment1() {
  // const [data, setData] = useState<Rate1Col[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getEnrollment1 = async () => {
    try {
      setLoading(true)
      // const response = await axios.get<PendingApplicantCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`);
      // const updatedData = response.data.map((item) => ({
      //   ...item,
      //   fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
      // }));
      // setPending(updatedData);
      // console.log(updatedData)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getEnrollment1();
  }, []);
  

  return (
      <div className="container py-6">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Enroll
              </Button>
            </DialogTrigger>
            <DialogContent>
                <EntryEnrollment1Form
                onCancel={getEnrollment1}
                onSuccess={() => {
                    getEnrollment1();
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
            title="enrollment 1" 
            onRefresh={getEnrollment1}
          />
        </div>
      <Toaster />
    </div>
      {/* <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <DataTable columns={columnsPending} data={pending} loading={loading} title="pending students" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Toaster /> */}
  )
}
