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
import { EditCourse } from "../FldrForm/editcourse"

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
        cell: ({ row }) => {
          const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
          const [courseCode, setCourseCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setCourseCode(code);
            setIsCourseDialogOpen(true);
          };

        //   const closeModal = () => {
        //     setIsCourseDialogOpen(false)
        //   }

          const handleCourseUpdate = (updatedCourse) => {
            console.log("Updated course details:", updatedCourse);
            setIsCourseDialogOpen(false);
          };


            return (
                <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                    <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.courseCode)}>
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
                        <DialogHeader>
                        <DialogTitle className="mb-4">View Course</DialogTitle>
                        </DialogHeader>
                    <EditCourse courseCode={courseCode} onSubmitSuccess={handleCourseUpdate} />
                        {/* <PendingApplicantEnrollment1Form studentCode={studentCode} /> */}
                    </DialogContent>
                </Dialog>
            )
        },
    },
]
