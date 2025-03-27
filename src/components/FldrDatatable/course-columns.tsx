import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CourseCol } from "@/FldrTypes/course.col"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader
  } from "@/components/ui/dialog"
import { useState } from "react"
import { CourseForm } from "../FldrForm/entrycourse"

export const columns: ColumnDef<CourseCol>[] = [
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
        accessorKey: "courseDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Course Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
          const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
          const [courseCode, setCourseCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setCourseCode(code);
            setIsCourseDialogOpen(true);
          };

          const handleCourseUpdate = () => {
            setIsCourseDialogOpen(false);
            // Call refresh function from table meta if available
            const onRefresh = table.options.meta?.refreshData;
            if (typeof onRefresh === 'function') {
              console.log("Refreshing course data after update");
              onRefresh();
            }
          };

          return (
            <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.courseCode)}>
                    <span className="sr-only">Edit course</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-labelledby="dialog-title">
                    <CourseForm 
                      editMode={true}
                      courseToEdit={courseCode} 
                      onCancel={handleCourseUpdate}
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
