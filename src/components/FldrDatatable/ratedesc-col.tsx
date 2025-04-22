import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader
  } from "@/components/ui/dialog"
import { useState } from "react"
import { RateDescCol } from "@/FldrTypes/ratedesc"
import { RateDescForm } from "../FldrForm/entryratedesc"

export const columns: ColumnDef<RateDescCol>[] = [
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
        accessorKey: "fieldNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                #
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.index + 1, 
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "RDID",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Rate Description ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    
    {
        accessorKey: "RDDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Rate Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },

    {
        id: "actions",
        cell: ({ row, table }) => {
          const [isRateDescDialogOpen, setIsRateDescDialogOpen] = useState(false);
          const [editRDID, setRDID] = useState("");

          const handleDialogOpen = (code: string) => {
            console.log("Opening edit dialog for subject:", code);
            setRDID(code);
            setIsRateDescDialogOpen(true);
          };

          const handleRateDescUpdate = () => {
            setIsRateDescDialogOpen(false);
            // Call refresh function from table meta if available
            const onRefresh = table.options.meta?.refreshData;
            if (typeof onRefresh === 'function') {
              console.log("Refreshing subject data after update");
              onRefresh();
            }
          };

          return (
            <Dialog open={isRateDescDialogOpen} onOpenChange={setIsRateDescDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.RDID)}>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-labelledby="dialog-title">
{/*                     {/* <DialogHeader>
                        <DialogTitle id="dialog-title">Edit Subject Description</DialogTitle>
                    </DialogHeader> */}
                    <RateDescForm
                        editMode={true}
                        RDToEdit={editRDID} 
                        onCancel={handleRateDescUpdate} //Works as both onSubmit and onCancel???
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
