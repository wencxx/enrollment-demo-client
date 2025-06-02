import { useState, useEffect } from "react";
import axios from "axios";
import { RoomCol } from "@/FldrTypes/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { RoomForm } from "@/components/FldrForm/entryRoom";
import { RoomTable } from "@/components/FldrDatatable/room-col";

export default function Room() {
  const [data, setData] = useState<RoomCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${plsConnect()}/API/WebAPI/ListController/ListRoom`)
      
      const formattedData = res.data.map((item: RoomCol) => ({
        roomCode: item.roomCode || "",
        roomDesc: item.roomDesc || "",
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
    <div className="container py-6">
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new room
              </Button>
            </DialogTrigger>
            <DialogContent>
                <RoomForm
                onCancel={getData}
                onSuccess={() => {
                    getData();
                    setIsDialogOpen(false);
                }}
                />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <RoomTable data={data} loading={loading} onRefresh={getData} />
        </div>
      <Toaster />
    </div>
  )
}
