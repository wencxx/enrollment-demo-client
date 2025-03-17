import { columns } from "@/components/FldrDatatable/ratecourse-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { RateCourseCol } from "@/FldrTypes/ratecourse-col";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { RateCourseForm } from "@/components/FldrForm/entryratecourse";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function RateCourse() {
  const [data, setData] = useState<RateCourseCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const getRateCourse = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WEBAPI/ListController/ListRateCourse`)
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRateCourse()
  }, []);

  return (
    <>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
              Add new rate course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-lg font-medium">Add new rate course</DialogTitle>
            <RateCourseForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={data} loading={loading} title="course rates" />
      </div>
      <Toaster />
    </>
  );
}
