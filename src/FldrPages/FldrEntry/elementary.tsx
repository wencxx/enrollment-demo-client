import { columns } from "@/components/FldrDatatable/elementary-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { ElementaryForm } from "@/components/FldrForm/entryelementary"
import { ElementaryCol } from "@/FldrTypes/highschool.col";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";

export default function HighSchool() {
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [data, setData] = useState<ElementaryCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)


  const getElementary = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/api/Elementary`)
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getElementary()
  }, []);

  return (
    <>
      <Button variant="outline" onClick={(() => setOpenForm(true))}>
        <Plus />
        Add new elementary
      </Button>

      <div className="mt-4">
        <DataTable columns={columns({getElementary})} data={data} loading={loading} title="Elementary" />
      </div>

      {/* dialog for adding prof */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogTitle className="text-lg font-medium">Add new course</DialogTitle>
          <ElementaryForm setOpenForm={setOpenForm} getElementary={getElementary} />
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
