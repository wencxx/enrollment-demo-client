import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { EditRate } from "../FldrForm/editRate"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"

export type RateCol = {
    rateCode: string
    subjectCode: string
    rateTypeCode: string
    rateTypeDesc: string
    noUnits: number
    rateAmount: number
    yearDesc: string
    courseDesc: string
    semDesc: string
    rowNum: number
}

export const columns: ColumnDef<RateCol>[] = [
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
        accessorKey: "rateCode",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Rate Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    // {
    //     accessorKey: "subjectCode",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Subject Code
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    // },
    // {
    //     accessorKey: "rateTypeDesc",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Type
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    // },
    // {
    //     accessorKey: "noUnits",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Units
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    // },
    // {
    //     accessorKey: "rateAmount",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Amount
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         return (
    //             <span>₱ {row.original.rateAmount}</span>
    //         )
    //     }
    // },
    {
        accessorKey: "courseDesc",
        header: ({ column }) => {
            
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Course
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "yearDesc",
        header: ({ column }) => {
            
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Year
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "semDesc",
        header: ({ column }) => {
            
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Semester
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const [rateCode, setRateCode] = useState("");

            const handleDialog = (rateCode: string) => {
            setRateCode(rateCode);
            setIsDialogOpen(true)
            }

            const handleUpdate = (updatedRate: any) => {
            console.log("Updated rate details:", updatedRate);
            setIsDialogOpen(false);
            };

            return (
            <>  
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialog(row.original.rateCode)}>
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[80dvw] lg:!max-w-[70dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                        <DialogHeader>
                        <DialogTitle className="mb-4">Edit Rate</DialogTitle>
                        </DialogHeader>
                        <EditRate rateCode={rateCode} onSubmitSuccess={handleUpdate}/>
                    </DialogContent>
                </Dialog>
            </>
            )
        },
        },
]


