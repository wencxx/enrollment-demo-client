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

import { CollegeTable } from "@/components/FldrDatatable/college-columns";
import { useState, useEffect } from "react";
import axios from "axios";
import { CollegeForm } from "@/components/FldrForm/entrycollege.tsx";
import { CollegeCol } from "@/FldrTypes/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'

export default function Elementary() {
  const [data, setData] = useState<ElementaryCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListCollege`)
      
      const formattedData = res.data.map((item: CollegeCol) => ({
        collegeCode: item.collegeCode || "",
        collegeDesc: item.collegeDesc || "",
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
                Add new elementary school
              </Button>
            </DialogTrigger>
            <DialogContent>
                <CollegeForm
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
          <ElementaryTable data={data} loading={loading} onRefresh={getData} />
        </div>
      <Toaster />
    </div>
  )
}
