import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SectionCol } from "@/FldrTypes/section"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    // DialogTitle,
    // DialogHeader
  } from "@/components/ui/dialog"
import { useState } from "react"
import { SectionForm } from "../FldrForm/entrySection"

export const columns: ColumnDef<SectionCol>[] = [
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
        accessorKey: "sectionCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Section Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "sectionDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Section Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
          const [isDialogOpen, setIsDialogOpen] = useState(false);
          const [sectionCode, setSectionCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setSectionCode(code);
            setIsDialogOpen(true);
          };

          const handleUpdate = () => {
            setIsDialogOpen(false);
            const onRefresh = table.options.meta?.refreshData;
            if (typeof onRefresh === 'function') {
              console.log("Refreshing course data after update");
              onRefresh();
            }
          };

          return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.sectionCode)}>
                    <span className="sr-only">Edit room</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-labelledby="dialog-title">
                    <SectionForm 
                      editMode={true}
                      toEdit={sectionCode} 
                      onCancel={handleUpdate}
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
