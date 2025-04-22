import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { approvedColumns } from "@/components/FldrDatatable/enrollment1approved-columns"
import { DataTable } from "@/components/FldrDatatable/data-table";
import { Enrollment1Col, StudentCol } from "@/FldrTypes/kim-types"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { pendingColumns } from "@/components/FldrDatatable/enrollment1pending-columns"

export default function Enrollment1() {
  const [approved, setApproved] = useState<Enrollment1Col[]>([]);
  const [pending, setPending] = useState<StudentCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true)
      const approvedRes = await axios.get<Enrollment1Col[]>(`${plsConnect()}/API/WEBAPI/Enrollment1Controller/ListEnrollment1`);
      const approvedData = approvedRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}${item.suffix ? ' '+item.suffix : ''}`,
        pkedDesc: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc} - ${item.sectionDesc} (${item.aYearDesc})`,
      }));
      setApproved(approvedData);
      console.log(approvedData)

      const pendingRes = await axios.get<StudentCol[]>(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`);
      const pendingData = pendingRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}${item.suffix ? ' '+item.suffix : ''}`,
      }));
      setPending(pendingData);
      console.log(pendingData)

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
        <Tabs defaultValue="pending" className="w-[full]">
          <TabsList className="grid w-[20vw] grid-cols-2">
            <TabsTrigger value="pending">Students</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="mt-4">
              <DataTable 
                columns={pendingColumns} 
                data={pending} 
                loading={loading} 
                title="students" 
                onRefresh={getData}
              />
            </div>
          </TabsContent>
          <TabsContent value="approved">
          <div className="mt-4">
            <DataTable 
              columns={approvedColumns} 
              data={approved} 
              loading={loading} 
              title="approved enrollments" 
              onRefresh={getData}
            />
          </div>
          </TabsContent>
        </Tabs>
        </div>
    </div>
    </>
  )
}
