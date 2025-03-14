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
import { Enrollment1Col } from "@/FldrTypes/enrollment1"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsEnrolled } from "@/components/FldrDatatable/enrollment2-col";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { DialogTitle } from "@radix-ui/react-dialog"

export default function Enrollment1() {
  // enrolled students
  const [list, setList] = useState<Enrollment1Col[]>([]);

  const fetchEnrollment1 = async () => {
    try {
      const response = await axios.get<Enrollment1Col[]>(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollment1WithName`);
      const updatedData = response.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
      }));
      setList(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEnrollment1();
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Enrollment 2
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[60dvw] lg:!max-w-[50dvw]" aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title" className="text-lg font-medium">Enrollment 2</DialogTitle>
          <Enrollment2Form />
        </DialogContent>
      </Dialog>

      <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <DataTable columns={columnsEnrolled} data={list} title="approved students" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Toaster />
    </>
  )
}
