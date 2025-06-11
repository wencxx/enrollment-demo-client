import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AssignedCol } from "@/FldrTypes/professor.col"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader
} from "@/components/ui/dialog"
import { EditProfessor } from "../FldrForm/editprofessor"
import { useState } from "react"

export const columns2: ColumnDef<AssignedCol>[] = [
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
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "enrollDescription.courseDesc",
        header: () => "Course",
        cell: ({ row }) => row.original.enrollDescription.courseDesc,
    },
    {
        accessorKey: "enrollDescription.yearDesc",
        header: () => "Year",
        cell: ({ row }) => row.original.enrollDescription.yearDesc,
    },
    {
        accessorKey: "enrollDescription.semDesc",
        header: () => "Semester",
        cell: ({ row }) => row.original.enrollDescription.semDesc,
    },
    {
        accessorKey: "enrollDescription.sectionDesc",
        header: () => "Section",
        cell: ({ row }) => row.original.enrollDescription.sectionDesc,
    },
    {
        id: "academicYear",
        header: () => "Academic Year",
        cell: ({ row }) => `${row.original.enrollDescription.ayStart}-${row.original.enrollDescription.ayEnd}`,
    },
    {
        accessorKey: "rdid",
        header: () => "RDID",
    },
    {
        accessorKey: "rdDesc",
        header: () => "RD Description",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [openEdit, setOpenEdit] = useState<boolean>(false)

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
                            {/* <EditProfessor data={rowData} getProfessor={getProfessor} setOpenEdit={setOpenEdit} /> */}
                            {/* <PendingApplicantEnrollment1Form studentCode={studentCode} /> */}
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]
