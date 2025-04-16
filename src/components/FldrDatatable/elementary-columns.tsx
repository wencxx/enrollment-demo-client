import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ElementaryCol } from "@/FldrTypes/highschool.col"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader
} from "@/components/ui/dialog"
import { EditElementary } from "../FldrForm/editelementary"
import { useState } from "react"

export const columns = ({ getElementary }: { getElementary: () => Promise<void> }): ColumnDef<ElementaryCol>[] => [
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
        accessorKey: "elementaryCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Elementary Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "elementaryDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Elementary Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [openEdit, setOpenEdit] = useState<boolean>(false)

            const rowData = {
                elementaryCode: row.original.elementaryCode,
                elementaryDesc: row.original.elementaryDesc,
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
                            <EditElementary data={rowData} getElementary={getElementary} setOpenEdit={setOpenEdit} />
                            {/* <PendingApplicantEnrollment1Form studentCode={studentCode} /> */}
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]
