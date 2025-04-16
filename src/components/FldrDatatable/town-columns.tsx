import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TownCol } from "@/FldrTypes/highschool.col"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader
} from "@/components/ui/dialog"
import { EditTown } from "../FldrForm/edittown"
import { useState } from "react"

export const columns = ({ getTown }: { getTown: () => Promise<void> }): ColumnDef<TownCol>[] => [
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
        accessorKey: "tcCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Town/City Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "tcDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Town/City Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [openEdit, setOpenEdit] = useState<boolean>(false)

            const rowData = {
                tcCode: row.original.tcCode,
                tcDesc: row.original.tcDesc,
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
                            <EditTown data={rowData} getTown={getTown} setOpenEdit={setOpenEdit} />
                            {/* <PendingApplicantEnrollment1Form studentCode={studentCode} /> */}
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]
