import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// import { format } from "date-fns";
// import { Badge } from "@/components/ui/badge"
// import moment from 'moment'
import { Enrollment1Col } from "@/FldrTypes/enrollment1"
import { Badge } from "../ui/badge"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"
import { EditStudent } from "../FldrForm/editstudent"
import { VoidEnrolledForm } from "../FldrForm/voidEnrolled"

export const columnsEnrolled: ColumnDef<Enrollment1Col>[] = [
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
        accessorKey: "studentStatus",
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
        cell: ({ row }) => {
            const status: boolean = row.getValue("studentStatus");
            // true is Regular, false is Irreg
            const displayStatus = status ? "Regular" : "Irregular";
          
            return (
              <div className="flex">
                {displayStatus}
              </div>
            );
          },
    },
    {
      accessorKey: "void",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Enrollment Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
      },
      cell: ({ row }) => {
           let variantType: "approve" | "disapprove" = "disapprove";
          const status: boolean = row.getValue("void");
          const displayStatus = status ? "Void" : "Approved";
          //reused custom badge colors: disapprove (red) and approve (green)
          if (status === true) {
              variantType = "disapprove";
            } else if (status === false) {
              variantType = "approve";
            }

          return (
            <div className="flex">
              <Badge variant={variantType}>
                  {displayStatus}
              </Badge>
            </div>
          );
        },
  },
    {
        id: "actions",
        cell: ({ row }) => {
          const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
          const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
          
          const [studentCode, setStudentCode] = useState("");

          const handleDialogOpen = (code: string) => {
            setStudentCode(code);
            setIsVoidDialogOpen(true);
          };

          const closeModal = () => {
            setIsVoidDialogOpen(false)
          }
          return (
            <>  
                <Dialog open={isVoidDialogOpen} onOpenChange={setIsVoidDialogOpen}>
                    <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.studentCode)}>
                        <span className="sr-only">Open menu</span>
                        <Ban className="h-4 w-4" />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto" aria-labelledby="dialog-title">
                        <DialogHeader>
                        {/* <DialogTitle className="mb-4">Void enrolled student</DialogTitle> */}
                        </DialogHeader>
                        <VoidEnrolledForm studentCode={studentCode} closeModal={closeModal}/>
                    </DialogContent>
                </Dialog>

                {/* HI ANDREA PLS ADD UR VIEW DETAILS MODAL (i like to use the dialog component from shadcn, like above.) HERE. MINE IS UP THERE.  */}
            </>
          )
        },
      },
]
