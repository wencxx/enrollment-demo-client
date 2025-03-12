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
import { Enrollment1Col } from "@/FldrTypes/enrollment1"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columns } from "@/components/FldrDatatable/enrollment1-col";
import { DataTable } from "@/components/FldrDatatable/data-table";

export default function Enrollment1() {
  const [data, setData] = useState<Enrollment1Col[]>([]);

  useEffect(() => {
    const fetchEnrollment1 = async () => {
      try {
        const response = await axios.get<Enrollment1Col[]>(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollment1WithName`);
        const updatedData = response.data.map((item) => ({
          ...item,
          fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
        }));
        setData(updatedData);
        console.log(updatedData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchEnrollment1();
  }, []);


  return (
    <>
    <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Enrollment 1
        </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
        {/* <StudentForm onSubmitSuccess={addNewStudent} /> */}
        <Enrollment1Form />
        </DialogContent>
    </Dialog>
    <ScrollArea className="mt-4 overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
          <DataTable columns={columns} data={data} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

    <Toaster />
    </>
  )
}
