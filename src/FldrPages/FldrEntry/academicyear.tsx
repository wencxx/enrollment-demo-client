import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { AcademicYear } from "@/FldrTypes/academic-year";
import { AcadYearForm } from "@/components/FldrForm/entryacademicyear";
import { acadYearColumns } from "@/components/FldrDatatable/academicyear";

export default function AcademicYearPage() {
  const [acadYear, setAcadYear] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAcadYears = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${plsConnect()}/api/AcademicYear`)
      setAcadYear(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAcadYears()
  }, []);

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
             <AcadYearForm onSuccess={fetchAcadYears} acadYear={acadYear} />
        </Card>

        <Card className="p-4">
            <DataTable 
              columns={acadYearColumns} 
              data={acadYear} 
              loading={loading} 
              title="Academic Years" 
              onRefresh={fetchAcadYears}
            />
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
