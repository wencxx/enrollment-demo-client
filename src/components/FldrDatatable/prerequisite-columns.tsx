import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { PrerequisiteCol } from "@/FldrTypes/subject-prerequisite"
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
        accessorKey: "subjectCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.subjectCode}</div>
                {row.original.subjectDesc && (
                    <div className="text-sm text-muted-foreground">{row.original.subjectDesc}</div>
                )}
            </div>
        ),
    },
    
    {
        accessorKey: "prerequisiteCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Prerequisite
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.prerequisiteCode}</div>
                {row.original.prerequisiteDesc && (
                    <div className="text-sm text-muted-foreground">{row.original.prerequisiteDesc}</div>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
          const [isPrerequisiteDialogOpen, setIsPrerequisiteDialogOpen] = useState(false);
          const [subjectCode, setSubjectCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setSubjectCode(code);
            setIsPrerequisiteDialogOpen(true);
          };

          const handlePrerequisiteUpdate = () => {
            setIsPrerequisiteDialogOpen(false);
            // Call refresh function from table meta if available
            const onRefresh = table.options.meta?.refreshData;
            if (typeof onRefresh === 'function') {
              console.log("Refreshing prerequisite data after update");
              onRefresh();
            }
          };

          return (
            <Dialog open={isPrerequisiteDialogOpen} onOpenChange={setIsPrerequisiteDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.subjectCode)}>
                    <span className="sr-only">Edit prerequisite</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden">
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
