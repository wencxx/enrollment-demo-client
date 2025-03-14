import { Enrollment1Form } from "@/components/FldrForm/entryenrollment1"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus } from 'lucide-react'
import { useState, useEffect } from "react"
import { PendingApplicantCol } from "@/FldrTypes/pendingapplicant"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsPending } from "@/components/FldrDatatable/pendingapplicant-col"
import { DataTable } from "@/components/FldrDatatable/data-table";
import { DialogTitle } from "@radix-ui/react-dialog"
export default function Enrollment1() {
  // applicants who are "Pending"
  const [pending, setPending] = useState<PendingApplicantCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPending = async () => {
    try {
      setLoading(true)
      const response = await axios.get<PendingApplicantCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`);
      const updatedData = response.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
      }));
      setPending(updatedData);
      console.log(updatedData)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);
  

  return (
    <>
      {/* <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Enrollment 1
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh]" aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title" className="text-lg font-medium">Enrollment 1</DialogTitle>
          <Enrollment1Form />
        </DialogContent>
      </Dialog> */}

      <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <DataTable columns={columnsPending} data={pending} loading={loading} title="pending students" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Toaster />
    </>
  )
}
