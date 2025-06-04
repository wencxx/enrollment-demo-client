import { useState, useEffect } from "react";
import axios from "axios";
import { ProfessorCol } from "@/FldrTypes/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { ProfessorForm } from "@/components/FldrForm/entryprofessor";
import { ProfessorTable } from "@/components/FldrDatatable/professor-columns";

export default function Room() {
  const [data, setData] = useState<ProfessorCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/api/Professors`)
      
      const formattedData = res.data.map((item: ProfessorCol) => ({
        professorCode: item.professorCode || "",
        professorName: item.professorName || "",
      }));
      
      setData(formattedData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getData()
  }, []);

  return (
    <div className="container py-6">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new professor
              </Button>
            </DialogTrigger>
            <DialogContent>
                <ProfessorForm
                onCancel={getData}
                onSuccess={() => {
                    getData();
                    setIsDialogOpen(false);
                }}
                />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <ProfessorTable data={data} loading={loading} onRefresh={getData} />
        </div>
      <Toaster />
    </div>
  )
}
