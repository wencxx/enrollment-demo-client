import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Semester } from "@/FldrTypes/kim-types";
import { SemesterForm } from "@/components/FldrForm/entrysemester";
import { semestersColumns } from "@/components/FldrDatatable/semester";

export default function SemesterPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const fetchSemesters = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${plsConnect()}/api/Semester`)

      setSemesters(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSemesters()
  }, []);

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
            <SemesterForm onSuccess={fetchSemesters} semesters={semesters} />
        </Card>

        <Card className="p-4">
            <DataTable 
              columns={semestersColumns} 
              data={semesters} 
              loading={loading} 
              title="Semesters" 
              onRefresh={fetchSemesters}
            />
        </Card>
      </div>
      <Toaster />
    </div>
  )
}