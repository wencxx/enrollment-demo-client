import { columns } from "@/components/FldrDatatable/professor-columns";
import { columns2 } from "@/components/FldrDatatable/assigned-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { ProfessorForm } from "@/components/FldrForm/entryprofessor"
import { AssignSubjectForm } from "@/components/FldrForm/entryassignsubject"
import { ProfessorCol, AssignedCol } from "@/FldrTypes/professor.col";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Professor() {
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [data, setData] = useState<ProfessorCol[]>([]);
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("professors");

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

   const getAssignedSubjects = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/SubjectAssignment`)
      setAssignedSubjects(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAssignedSubjects()
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="professors">Professors</TabsTrigger>
        <TabsTrigger value="assign">Assign Subject</TabsTrigger>
      </TabsList>
      <TabsContent value="professors">
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
      </TabsContent>
      <TabsContent value="assign">
        <Button variant="outline" onClick={(() => setOpenForm(true))}>
          <Plus />
          Assign Subject
        </Button>
        <div className="mt-4">
          <DataTable columns={columns2} data={assignedSubjects} loading={loading} title="professors and their assigned subjects" />
        </div>

        {/* dialog for adding prof */}
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogTitle className="text-lg font-medium">Assign Subject</DialogTitle>
            <AssignSubjectForm setOpenForm={setOpenForm} getAssignedSubjects={getAssignedSubjects} />
          </DialogContent>
        </Dialog>
        <Toaster />
      </TabsContent>
    </Tabs>
  )
}
