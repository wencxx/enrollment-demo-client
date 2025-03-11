import { RateCol, columns } from "@/components/FldrDatatable/rate-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus } from 'lucide-react'
import { RateForm } from "@/components/FldrForm/entryrate";



export default function Rate() {
  const [data, setData] = useState<RateCol[]>([]);

  useEffect(() => {
    axios
      .get<RateCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListRate`)
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
          Add Rate
        </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
        <RateForm />
        </DialogContent>
    </Dialog>
    <DataTable columns={columns} data={data}/>
    <Toaster />
    </>
    
  );
}
