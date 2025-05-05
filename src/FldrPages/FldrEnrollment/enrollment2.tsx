import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsEnrolled } from "@/components/FldrDatatable/enrollment2-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";

export default function Enrollment2() {
  // enrolled students
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${plsConnect()}/api/Enrollment2/ListEnrollment2Student`);
      
      const updatedData = response.data.map((item: any) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
      }));
      
      setList(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">Subject Loading</h1>
        
        <ScrollArea className="overflow-x-auto min-w-full whitespace-nowrap rounded-md">
          <DataTable 
            columns={columnsEnrolled} 
            data={list} 
            loading={loading} 
            title="Students" 
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Toaster />
      </div>
    </>
  )
}