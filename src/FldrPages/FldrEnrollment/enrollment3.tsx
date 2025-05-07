import { Enrollment3Form } from "@/components/FldrForm/entryenrollment3"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus } from 'lucide-react'
import { useState, useEffect } from "react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsEnrolled } from "@/components/FldrDatatable/enrollment3-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { DialogTitle } from "@radix-ui/react-dialog"
import { Enrollment3Type2 } from "@/FldrTypes/enrollment3"

export default function Enrollment3() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [list, setList] = useState<Enrollment3Type2[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEnrollment3 = async () => {
    try {
      const res = await axios.get(`${plsConnect()}/WebApi/Assessment/Enrollment3`);

      if (res.status === 200) {
        setList(res.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEnrollment3();
  }, []);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Enrollment 3
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[60dvw] lg:!max-w-[50dvw]" aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title" className="text-lg font-medium">Enrollment 3</DialogTitle>
          <Enrollment3Form setList={setList} setDialogOpen={setDialogOpen} />
        </DialogContent>
      </Dialog>

      <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <DataTable columns={columnsEnrolled} data={list} loading={loading} title="approved students" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Toaster />
    </>
  )
}
