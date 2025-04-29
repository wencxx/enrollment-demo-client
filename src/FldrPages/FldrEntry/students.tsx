import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { allStudentsCol } from "@/components/FldrDatatable/allStudents-col"
import { DataTable } from "@/components/FldrDatatable/data-table";
import { Enrollment1Col, StudentCol } from "@/FldrTypes/kim-types"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
  } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
  


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

  const handleBatchReset = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${plsConnect()}/API/WebAPI/StudentController/ResetEnrollmentStatus`);
      console.log(res.data.message);
      getData();
      toast("All approved statues reset successfully.");
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
      <>
      <div className="container py-6">
        <div className="flex flex-wrap items-center gap-2">
        <Button 
            onClick={getData}
            disabled={loading}
            variant="outline"
        >
            {loading ? (
            <>
                Refreshing...
            </>
            ) : (
            "Refresh Data"
            )}
        </Button>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={loading}>
                Reset Enrollment Status
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will reset the enrollment status of all <strong>Approved</strong> students to <strong>Pending</strong>. This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBatchReset}>
                    Reset
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        </div>
        <div className="space-x-2 mt-3">
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
