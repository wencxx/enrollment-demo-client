import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EnrollDescCol } from "@/FldrTypes/enrolldesc.col"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { EnrollDesciprtionForm } from "../FldrForm/editenrolldescription"

export const columns = ({ getEnrollDescription }: { getEnrollDescription: () => void }): ColumnDef<EnrollDescCol>[] => [
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
        accessorKey: "pkedCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "yearDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Year
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "courseDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Course
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "semDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Semester
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
                Section
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "aYearDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Academic Year
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const form = row.original
            const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);

            const handleDialogOpen = () => {
                setIsCourseDialogOpen(true);
            };

            return (
                <>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen()}>
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                        <DialogContent className="max-w-md" aria-labelledby="dialog-title">
                            <EnrollDesciprtionForm data={form} getEnrollDescription={getEnrollDescription} />
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
]
