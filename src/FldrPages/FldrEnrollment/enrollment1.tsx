import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { PendingApplicantCol } from "@/FldrTypes/pendingapplicant"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsPending } from "@/components/FldrDatatable/pendingapplicant-columns"
import { DataTable } from "@/components/FldrDatatable/data-table";
export default function Enrollment1() {
  // applicants who are "Pending"
  const [pending, setPending] = useState<PendingApplicantCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPending = async () => {
    try {
      setLoading(true)
      const response = await axios.get<PendingApplicantCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`);
      const updatedData = response.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
      }));
      setPending(updatedData);
      console.log(updatedData)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);
  

  return (
    <>
      <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <DataTable columns={columnsPending} data={pending} loading={loading} title="pending students" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Toaster />
    </>
  )
}
