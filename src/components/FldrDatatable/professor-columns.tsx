import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ProfessorCol } from "@/FldrTypes/professor.col"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader
} from "@/components/ui/dialog"
import { EditProfessor } from "../FldrForm/editprofessor"
import { useState } from "react"

export const columns = ({ getProfessor }: { getProfessor: () => Promise<void> }): ColumnDef<ProfessorCol>[] => [
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
        accessorKey: "professorCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Professor Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "professorName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Professor Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [openEdit, setOpenEdit] = useState<boolean>(false)

            const rowData = {
                professorCode: row.original.professorCode,
                professorName: row.original.professorName,
            };


            return (
                <>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setOpenEdit(true)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog open={openEdit} onOpenChange={setOpenEdit} >
                        
                        <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
                            <DialogHeader>
                                <DialogTitle className="mb-4"></DialogTitle>
                            </DialogHeader>
                            <EditProfessor data={rowData} getProfessor={getProfessor} setOpenEdit={setOpenEdit} />
                            {/* <PendingApplicantEnrollment1Form studentCode={studentCode} /> */}
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]
