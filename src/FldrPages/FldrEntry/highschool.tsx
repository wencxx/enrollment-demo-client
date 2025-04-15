import { columns } from "@/components/FldrDatatable/highschool-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { HighschoolForm } from "@/components/FldrForm/entryhighschool"
import { HighSchoolCol } from "@/FldrTypes/highschool.col";
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
  const [data, setData] = useState<HighSchoolCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)


  const getHighschool = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/api/Highschool`)
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHighschool()
  }, []);

  return (
    <>
      <Button variant="outline" onClick={(() => setOpenForm(true))}>
        <Plus />
        Add new high school
      </Button>

      <div className="mt-4">
        <DataTable columns={columns({getHighschool})} data={data} loading={loading} title="high schools" />
      </div>

      {/* dialog for adding prof */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogTitle className="text-lg font-medium">Add new course</DialogTitle>
          <HighschoolForm setOpenForm={setOpenForm} getHighschool={getHighschool} />
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
