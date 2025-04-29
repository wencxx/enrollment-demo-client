import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { allStudentsCol } from "@/components/FldrDatatable/allStudents-col"
import { DataTable } from "@/components/FldrDatatable/data-table";
import { Enrollment1Col, StudentCol } from "@/FldrTypes/kim-types"

export default function Students() {
  const [approved, setApproved] = useState<Enrollment1Col[]>([]);
  const [allStudents, setAllStudents] = useState<StudentCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getData = async () => {
    try {
      setLoading(true)
      const allRes = await axios.get<StudentCol[]>(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`);
      const allData = allRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}${item.suffix ? ' '+item.suffix : ''}`,
      }));
      setAllStudents(allData);
      console.log(allData)

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);
  

  return (
      <>
      <div className="container py-6">
        <div className="space-x-2">
              <DataTable 
                columns={allStudentsCol} 
                data={allStudents} 
                loading={loading} 
                title="all students" 
                onRefresh={getData}
              />
        </div>
    </div>
    </>
  )
}
