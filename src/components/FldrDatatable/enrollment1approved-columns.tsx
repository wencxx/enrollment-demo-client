import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Enrollment1Col } from "@/FldrTypes/kim-types"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
import { EntryEnrollment1Form } from "../FldrForm/entryEnrollment1"
import { ViewEnrollment1Form } from "../FldrForm/viewEnrollment1"

export const approvedColumns: ColumnDef<Enrollment1Col>[] = [
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
    accessorKey: "pkCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PKCode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  // {
  //   accessorKey: "studentCode",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Student Code
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  // },
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
    accessorKey: "pkedDesc",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enrollment Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [pkRate, setPKRate] = useState("");

      const handleDialogOpen = (code: string) => {
        setPKRate(code);
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
            onClick={() => handleDialogOpen(row.original.pkCode)}>
                <span className="sr-only">Edit rate2</span>
                <Eye className="h-4 w-4" />
            </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[40dvw] lg:!max-w-[45dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                {/* list of details */}
                <ViewEnrollment1Form
                  toEdit={pkRate} 
                  onCancel={handleUpdate}
                />
            </DialogContent>
        </Dialog>
      );
    },
},
]