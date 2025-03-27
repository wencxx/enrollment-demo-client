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
import { DialogTitle } from "@radix-ui/react-dialog";



export default function Rate() {
  const [rates, setRate] = useState<RateCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchRate = async () => {
    try {
      setLoading(true);
      const response = await axios.get<RateCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListDistinctRate`);
      setRate(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  const handleAddRate = async () => {
    await fetchRate();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <div className="space-x-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
              Add Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[80dvw] lg:!max-w-[70dvw] scrollbar-hidden" aria-labelledby="dialog-title">
            <DialogTitle id="dialog-title" className="text-lg font-medium">Add new rate</DialogTitle>
            <RateForm onSubmitSuccess={handleCloseDialog} onAddRate={handleAddRate} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={rates} loading={loading} title="rates" />
      </div>
      <Toaster />
    </>

  );
}
