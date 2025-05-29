import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Eye, Stamp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { StudentCol } from "@/FldrTypes/types"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ViewStudent } from "../FldrForm/viewStudent"
import { EditEnrollStatus } from "../FldrForm/editenrollstatus"


export const allStudentsCol: ColumnDef<StudentCol>[] = [
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
    accessorKey: "studentCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [code, setCode] = useState("");

      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const [editCode, setEditCode] = useState("");
      

      const handleDialogOpen = (code: string) => {
        setCode(code);
        setIsDialogOpen(true);
      };

      const handleEditDialogOpen = (editCode: string) => {
        setEditCode(editCode);
        setIsEditDialogOpen(true);
      };

      const handleUpdate = () => {
        setIsDialogOpen(false);
        const onRefresh = table.options.meta?.refreshData;
        if (typeof onRefresh === 'function') {
          console.log("Refreshing...");
          onRefresh();
        }
      };

      const handleEditUpdate = () => {
        setIsEditDialogOpen(false);
        const onRefresh = table.options.meta?.refreshData;
        if (typeof onRefresh === 'function') {
          console.log("Refreshing...");
          onRefresh();
        }
      };

      return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"
            onClick={() => handleDialogOpen(row.original.studentCode)}>
                <span className="sr-only">Enrollment1</span>
                <Eye className="h-4 w-4" />
            </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[40dvw] lg:!max-w-[45dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogTitle>
                  <h2 className="text-lg font-semibold ps-6">Student details</h2>
                </DialogTitle>
                <ViewStudent
                  toEdit={code} 
                  // onCancel={handleUpdate}
                />
            </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"
            onClick={() => handleEditDialogOpen(row.original.studentCode)}>
                <span className="sr-only">Enroll status</span>
                <Edit className="h-4 w-4" />
            </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[30dvw] lg:!max-w-[35dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogTitle>
                <h2 className="text-lg font-semibold">Update enrollment status</h2>
                </DialogTitle>
                <EditEnrollStatus
                toEdit={editCode} 
                onCancel={handleEditUpdate}
                />
            </DialogContent>
        </Dialog>
        </>
      );
    },
},
]