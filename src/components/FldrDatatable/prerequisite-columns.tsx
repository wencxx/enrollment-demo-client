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
import { PrerequisiteCol, SubjectCol } from "@/FldrTypes/subject-prerequisite"
import { PrerequisiteForm } from "@/components/FldrForm/entryprerequisite"

export const prerequisiteColumns: ColumnDef<PrerequisiteCol>[] = [
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
        accessorKey: "prerequisiteCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Prerequisite Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
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
        id: "actions",
        cell: ({ row }) => {
          const [isPrerequisiteDialogOpen, setIsPrerequisiteDialogOpen] = useState(false);
          const [subjectCode, setSubjectCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setSubjectCode(code);
            setIsPrerequisiteDialogOpen(true);
          };

          const handlePrerequisiteUpdate = () => {
            setIsPrerequisiteDialogOpen(false);
          };

          return (
            <Dialog open={isPrerequisiteDialogOpen} onOpenChange={setIsPrerequisiteDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.subjectCode)}>
                    <span className="sr-only">Open menu</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
                    {/* <DialogHeader>
                        <DialogTitle id="dialog-title">Edit Prerequisite</DialogTitle>
                    </DialogHeader> */}
                    <PrerequisiteForm 
                        editMode={true}
                        subjectToEdit={subjectCode} 
                        onCancel={handlePrerequisiteUpdate} 
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
