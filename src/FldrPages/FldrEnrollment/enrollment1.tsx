import { Enrollment1Form } from "@/components/FldrForm/entryenrollment1"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus, Minus } from 'lucide-react'
import { useState, useEffect } from "react"
import { Enrollment1Col } from "@/FldrTypes/enrollment1"
import { PendingApplicantCol } from "@/FldrTypes/pendingapplicant"
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import axios from "axios"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { columnsEnrolled } from "@/components/FldrDatatable/enrollment1-col";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { columnsPending } from "@/components/FldrDatatable/pendingapplicant-col"

export default function Enrollment1() {
  // enrolled students
  const [list, setList] = useState<Enrollment1Col[]>([]);
  const [minimizeList, setMinimizeList] = useState(true);
  const toggleListMinimize = () => {
    setMinimizeList(!minimizeList);
  };

  useEffect(() => {
    const fetchEnrollment1 = async () => {
      try {
        const response = await axios.get<Enrollment1Col[]>(`${plsConnect()}/API/WEBAPI/ListController/ListEnrollment1WithName`);
        const updatedData = response.data.map((item) => ({
          ...item,
          fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
        }));
        setList(updatedData);
        console.log(updatedData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchEnrollment1();
  }, []);

  // applicants who are "Pending"
  const [pending, setPending] = useState<PendingApplicantCol[]>([]);
  const [minimizePending, setMinimizePending] = useState(false);
  const toggleListPending = () => {
    setMinimizePending(!minimizePending);
  };

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await axios.get<PendingApplicantCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListApplicant`);
        const updatedData = response.data.map((item) => ({
          ...item,
          fullName: `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`,
        }));
        setPending(updatedData);
        console.log(updatedData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchPending();
  }, []);

  return (
    <>
    <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Enrollment 1
        </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
          <Enrollment1Form />
        </DialogContent>
    </Dialog>

    <Card className="mt-4 overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            List of pending applicants
            <Button variant="outline" className="ml-auto" onClick={toggleListPending}>
            {minimizePending ? <Plus /> : <Minus />}
          </Button>
          </CardTitle>
        </CardHeader>
        {!minimizePending && (
          <CardContent>
            <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
                <DataTable columns={columnsPending} data={pending} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          </CardContent>
        )}
      </Card>

    <Card className="mt-4 overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            List of enrolled students
            <Button variant="outline" className="ml-auto" onClick={toggleListMinimize}>
            {minimizeList ? <Plus /> : <Minus />}
          </Button>
          </CardTitle>
        </CardHeader>
        {!minimizeList && (
          <CardContent>
            <ScrollArea className="overflow-x-auto min-w-full max-w-screen-lg mx-auto whitespace-nowrap rounded-md">
                <DataTable columns={columnsEnrolled} data={list} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          </CardContent>
        )}
      </Card>

    <Toaster />
      
    </>
  )
}
