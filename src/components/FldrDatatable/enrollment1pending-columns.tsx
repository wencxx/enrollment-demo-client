import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Stamp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { StudentCol } from "@/FldrTypes/kim-types"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
import { EntryEnrollment1Form } from "../FldrForm/entryEnrollment1"


export const pendingColumns: ColumnDef<StudentCol>[] = [
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

      const handleDialogOpen = (code: string) => {
        setCode(code);
        setIsDialogOpen(true);
      };

      const handleUpdate = () => {
        setIsDialogOpen(false);
        const onRefresh = table.options.meta?.refreshData;
        if (typeof onRefresh === 'function') {
          console.log("Refreshing...");
          onRefresh();
        }
      };

      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"
            onClick={() => handleDialogOpen(row.original.studentCode)}>
                <span className="sr-only">Enrollment1</span>
                <Stamp className="h-4 w-4" />
            </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[40dvw] lg:!max-w-[45dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                <EntryEnrollment1Form
                  toEdit={code} 
                  onCancel={handleUpdate}
                />
            </DialogContent>
        </Dialog>
      );
    },
},
]