import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// import { format } from "date-fns";
// import { Badge } from "@/components/ui/badge"
// import moment from 'moment'
import { Enrollment2Col } from "@/FldrTypes/enrollment2"
import { Badge } from "../ui/badge"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"
import { VoidEnrolledForm } from "../FldrForm/voidEnrolled"

export const columnsEnrolled: ColumnDef<Enrollment2Col>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
        accessorKey: "pkCode",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    PK
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "rowNum",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Row Num
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "rdDesc",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Subject
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
      accessorKey: "professorName",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Professor
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
      },
  },
  {
    accessorKey: "roomDesc",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Room
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
}, 
{
    accessorKey: "scheduleDayDesc",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Day
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
},
{
    accessorKey: "classStart",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Class Start
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
        const value = row.getValue("classStart");
        console.log("Class Start value:", value); // Add this for debugging
        return value || "N/A";
    }
},
{
    accessorKey: "classEnd",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Class End
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
},
{
    accessorKey: "noUnits",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Units
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
},
{
    accessorKey: "amount",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
},

    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //       const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
    //       const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
          
    //       const [studentCode, setStudentCode] = useState("");

    //       const handleDialogOpen = (code: string) => {
    //         setStudentCode(code);
    //         setIsVoidDialogOpen(true);
    //       };

    //       const closeModal = () => {
    //         setIsVoidDialogOpen(false)
    //       }
    //       return (
    //         <>  
    //             <Dialog open={isVoidDialogOpen} onOpenChange={setIsVoidDialogOpen}>
    //                 <DialogTrigger asChild>
    //                 <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.studentCode)}>
    //                     <span className="sr-only">Open menu</span>
    //                     <Ban className="h-4 w-4" />
    //                 </Button>
    //                 </DialogTrigger>
    //                 <DialogContent className="max-h-[90vh] overflow-y-auto" aria-labelledby="dialog-title">
    //                     <DialogHeader>
    //                     {/* <DialogTitle className="mb-4">Void enrolled student</DialogTitle> */}
    //                     </DialogHeader>
    //                     <VoidEnrolledForm studentCode={studentCode} closeModal={closeModal}/>
    //                 </DialogContent>
    //             </Dialog>
    //         </>
    //       )
    //     },
    //   },
]
