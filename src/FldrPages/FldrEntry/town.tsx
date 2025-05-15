import { columns } from "@/components/FldrDatatable/town-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { TownForm } from "@/components/FldrForm/entrytown";
import { TownCol } from "@/FldrTypes/highschool.col";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Town() {
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [data, setData] = useState<TownCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)


  const getTown = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/api/TownCity/ListTown`)
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTown()
  }, []);

  return (
    <>
      <Button variant="outline" onClick={(() => setOpenForm(true))}>
        <Plus />
        Add new town/city
      </Button>

      <div className="mt-4">
        <DataTable columns={columns({getTown})} data={data} loading={loading} title="Town/City" />
      </div>

      {/* dialog for adding prof */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogTitle className="text-lg font-medium">Add new town/city</DialogTitle>
          <TownForm setOpenForm={setOpenForm} getTown={getTown} />
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
