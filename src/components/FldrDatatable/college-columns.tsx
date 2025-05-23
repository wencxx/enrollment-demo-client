import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CollegeCol } from "@/FldrTypes/types"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    // DialogTitle,
    // DialogHeader
  } from "@/components/ui/dialog"
import { useState } from "react"
import { CollegeForm } from "../FldrForm/entrycollege"

export const columns: ColumnDef<CollegeCol>[] = [
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
        accessorKey: "collegeCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "collegeDesc",
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
        id: "actions",
        cell: ({ row, table }) => {
          const [isDialogOpen, setIsDialogOpen] = useState(false);
          const [collegeCode, setCollegeCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setCollegeCode(code);
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
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.collegeCode)}>
                    <span className="sr-only">Edit room</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-labelledby="dialog-title">
                    <CollegeForm 
                      editMode={true}
                      toEdit={collegeCode} 
                      onCancel={handleUpdate}
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
