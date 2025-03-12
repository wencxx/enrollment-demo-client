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

export default function RateCourse() {
  const [data, setData] = useState<RateCourseCol[]>([]);

  useEffect(() => {
    axios
      .get<RateCourseCol[]>(
        `${plsConnect()}/API/WEBAPI/ListController/ListRateCourse`
      )
      .then((response) => {
        setData(response.data);
        console.log("wtf", data);
        console.log("plsConnect:", plsConnect);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Add new rate course
          </Button>
        </DialogTrigger>
        <DialogContent>
          <RateCourseForm />
        </DialogContent>
      </Dialog>
      <div className="mt-4">
        <DataTable columns={columns} data={data} />
      </div>
      <Toaster />
    </>
  );
}
