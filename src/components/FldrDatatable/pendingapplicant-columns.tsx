import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Stamp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PendingApplicantCol } from "@/FldrTypes/pendingapplicant"
import { PendingApplicantEnrollment1Form } from "../FldrForm/entryPendingEnrollment1"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription
} from "@/components/ui/dialog"

export const columnsPending: ColumnDef<PendingApplicantCol>[] = [
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
    accessorKey: "enrollStatusCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [studentCode, setStudentCode] = useState("");

      const handleDialogOpen = (code: string) => {
        setStudentCode(code);
        setIsDialogOpen(true);
      };

      const closeModal = () => {
        setIsDialogOpen(false)
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.studentCode)}>
                    <span className="sr-only">Open menu</span>
                    <Stamp className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden" aria-labelledby="dialog-title">
                  <DialogHeader>
                    <DialogTitle className="mb-4">Begin student enrollment</DialogTitle>
                    <DialogDescription>
                    The student is matriculating for the <strong className="text-red-500">first time</strong>. Please enter <strong>year, semester, course, and AY</strong> according to the details of the semester the student will enroll in.
                </DialogDescription>
                  </DialogHeader>
                  <PendingApplicantEnrollment1Form studentCode={studentCode} closeModal={closeModal} />
                </DialogContent>
              </Dialog>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            </DropdownMenuContent>
          </DropdownMenu>

        </>
      )
    },
  },
]

