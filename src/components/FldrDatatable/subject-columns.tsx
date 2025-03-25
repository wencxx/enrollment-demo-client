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
import { SubjectCol } from "@/FldrTypes/subject-prerequisite"
import { SubjectForm } from "@/components/FldrForm/entrysubject"

export const subjectColumns: ColumnDef<SubjectCol>[] = [
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
        accessorKey: "subjectCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    
    {
        accessorKey: "subjectDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
          const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
          const [subjectCode, setSubjectCode] = useState("");

          const handleDialogOpen = (code: string) => {
            console.log("Opening edit dialog for subject:", code);
            setSubjectCode(code);
            setIsSubjectDialogOpen(true);
          };

          const handleSubjectUpdate = () => {
            setIsSubjectDialogOpen(false);
            // Call refresh function from table meta if available
            const onRefresh = table.options.meta?.refreshData;
            if (typeof onRefresh === 'function') {
              console.log("Refreshing subject data after update");
              onRefresh();
            }
          };

          return (
            <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.subjectCode)}>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-labelledby="dialog-title">
{/*                     {/* <DialogHeader>
                        <DialogTitle id="dialog-title">Edit Subject Description</DialogTitle>
                    </DialogHeader> */}
                    <SubjectForm 
                        editMode={true}
                        subjectToEdit={subjectCode} 
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
