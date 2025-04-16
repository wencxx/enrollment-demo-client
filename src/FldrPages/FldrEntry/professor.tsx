import { columns } from "@/components/FldrDatatable/professor-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { ProfessorForm } from "@/components/FldrForm/entryprofessor"
import { ProfessorCol } from "@/FldrTypes/professor.col";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Professor() {
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [data, setData] = useState<ProfessorCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)


  const getProfessor = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/api/Professors`)
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfessor()
  }, []);

  return (
    <>
      <Button variant="outline" onClick={(() => setOpenForm(true))}>
        <Plus />
        Add professor
      </Button>

      <div className="mt-4">
        <DataTable columns={columns({getProfessor})} data={data} loading={loading} title="professors" />
      </div>

      {/* dialog for adding prof */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogTitle className="text-lg font-medium">Add new course</DialogTitle>
          <ProfessorForm setOpenForm={setOpenForm} getProfessor={getProfessor} />
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
