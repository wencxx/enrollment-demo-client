import { Enrollment2Form } from "@/components/FldrForm/entryenrollment2"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus } from 'lucide-react'
import { useState, useEffect } from "react"
import { Enrollment2Details } from "@/FldrTypes/enrollment2"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsEnrolled } from "@/components/FldrDatatable/enrollment2-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { DialogTitle } from "@radix-ui/react-dialog"

export default function Enrollment2() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  // enrolled students
  const [list, setList] = useState<Enrollment2Details[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEnrollment2 = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Enrollment2Details[]>(`${plsConnect()}/api/Enrollment2/AllData`);
      console.log("FULL API RESPONSE SAMPLE:", response.data[0]); // Log first item
      const updatedData = response.data.map((item) => ({
        ...item,
        fullName: `${item.FirstName} ${item.MiddleName ? item.MiddleName + ' ' : ''}${item.LastName}`,
      }));
      setList(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchEnrollment2();
  }, []);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Enrollment 2
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[70dvw] lg:!max-w-[60dvw]" aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title" className="text-lg font-medium">Enrollment 2</DialogTitle>
          <Enrollment2Form closeModal={() => setDialogOpen(false)}/>
        </DialogContent>
      </Dialog>

      <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <DataTable columns={columnsEnrolled} data={list} loading={loading} title="Schedules" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

        <Toaster />

    </>
  )
}
