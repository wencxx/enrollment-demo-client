import { subjectColumns } from "@/components/FldrDatatable/subject-columns";
import { prerequisiteColumns } from "@/components/FldrDatatable/prerequisite-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { SubjectForm } from "@/components/FldrForm/entrysubject";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { SubjectCol } from "@/FldrTypes/subject-prerequisite";
import { PrerequisiteCol } from "@/FldrTypes/subject-prerequisite";
import { PrerequisiteForm } from "@/components/FldrForm/entryprerequisite";

export default function Subject() {
  const [subjectData, setSubjectData] = useState<SubjectCol[]>([]);
  const [prerequisiteData, setPrerequisiteData] = useState<PrerequisiteCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getSubject = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/RateController/ListRateDesc`)
      
      // Format data with fieldNumber for consistent structure
      const formattedData = res.data.map((item: any, index: number) => ({
        RDCode: item.RDCode || item.rdCode,
        RDID: item.RDID || item.rdid,
        RDDesc: item.RDDesc || item.rdDesc
      }));
      
      setSubjectData(formattedData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getPrerequisite = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WEBAPI/Prerequisite/all`)
      
      console.log("API response for prerequisites:", res.data) // Debug output
      
      // Format data with fieldNumber for consistent structure
      const formattedData = Array.isArray(res.data) && res.data.length > 0 
        ? res.data.map((item: any, index: number) => ({
            RDID: item.RDID || item.rdid,
            prerequisiteCode: item.PrerequisiteCode || item.prerequisiteCode,
          }))
        : [];
      
      console.log("Formatted prerequisite data:", formattedData) // Debug output
      setPrerequisiteData(formattedData)
    } catch (error) {
      console.error("Error fetching prerequisites:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPrerequisite()
    getSubject()
  }, []);


  // Refresh both tables
  const refreshAll = async() => {
    await Promise.all([
      getSubject(),
      getPrerequisite()
    ]);
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Subjects Card */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subjects</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add new subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* <DialogHeader>
                  <DialogTitle>Add new subject</DialogTitle>
                </DialogHeader> */}
                
                {/* Works as both onCancel and onSubmit */}
                <SubjectForm onCancel={refreshAll} /> 
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <DataTable 
              columns={subjectColumns} 
              data={subjectData} 
              loading={loading} 
              title="subjects" 
              onRefresh={refreshAll}
            />
          </div>
        </Card>

        {/* Prerequisites Card */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prerequisites</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={subjectData.length <= 1}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add new prerequisite
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* <DialogHeader>
                  <DialogTitle>Add new prerequisite</DialogTitle>
                </DialogHeader> */}
                <PrerequisiteForm onCancel={refreshAll} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <DataTable 
              columns={prerequisiteColumns} 
              data={prerequisiteData} 
              loading={loading} 
              title="prerequisites" 
              onRefresh={refreshAll}
            />
          </div>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
