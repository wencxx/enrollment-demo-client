import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    // DialogTitle,
    // DialogHeader
  } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Rate2Col } from "@/FldrTypes/kim-types"
import { EditRate1Form } from "../FldrForm/editRate1"
import { EditRate2Form } from "../FldrForm/editRate2"

export const columns: ColumnDef<Rate2Col>[] = [
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
        accessorKey: "courseDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Course
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "yearDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Year
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "rdDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "rateTypeDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
          const [isDialogOpen, setIsDialogOpen] = useState(false);
          const [pkRate, setPKRate] = useState("");

          const handleDialogOpen = (code: string) => {
            setPKRate(code);
            setIsDialogOpen(true);
          };

          const handleUpdate = () => {
            setIsDialogOpen(false);
            const onRefresh = table.options.meta?.refreshData;
            if (typeof onRefresh === 'function') {
              console.log("Refreshing...");
              onRefresh();
            }
          };

          return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"
                onClick={() => handleDialogOpen(row.original.pkRate)}>
                    <span className="sr-only">Edit rate2</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-labelledby="dialog-title">
                    <EditRate2Form
                      toEdit={pkRate} 
                      onCancel={handleUpdate}
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
