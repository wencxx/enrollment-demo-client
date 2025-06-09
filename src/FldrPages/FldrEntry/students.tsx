import { useState, useEffect } from "react";
import axios from "axios";
import { StudentCol } from "@/FldrTypes/types";
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { StudentsTable } from "@/components/FldrDatatable/allStudents-col";
import { RefreshCw } from "lucide-react";

export default function Students() {
  const [data, setData] = useState<StudentCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`)
      
      const formattedData = res.data.map((item: StudentCol) => ({
        ...item,
        fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}${item.suffix ? ' '+item.suffix : ''}`,
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
    <div className="container">
        <div className="space-x-2">
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
            <RefreshCw />
            )}
        </Button>
        {/* FOR: Resetting EnrollStatusCode in tblEntryStudent back to "Pending". No longer used. */}
        {/* <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={loading}>
                Reset Enrollment Status
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will reset the enrollment status of all <strong>Approved</strong> students to <strong>Pending</strong>, to end the semester and prepare for re-enrollment. This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBatchReset} className="bg-red-500 text-white hover:bg-red-600" >
                    Reset
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog> */}

        </div>
        <div className="mt-4">
          <StudentsTable data={data} loading={loading} onRefresh={getData} />
        </div>
      <Toaster />
    </div>
  )
}
