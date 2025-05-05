import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { user2 } from "@/FldrTypes/user"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog"
import { useState } from "react"
import { EditUserGroup } from "../FldrForm/editusergroup"

export const columns: ColumnDef<user2>[] = [
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
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Fullname
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "userName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Username
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "groupName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Group Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
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
                onClick={() => handleDialogOpen(row.original.userCode)}>
                    <span className="sr-only">User Group</span>
                    <Edit className="h-4 w-4" />
                </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[40dvw] lg:!max-w-[45dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogTitle>
                  <h2 className="text-lg font-semibold">Edit User Group</h2>
                </DialogTitle>
                <EditUserGroup
                      toEdit={code} 
                      onCancel={handleUpdate}
                    />
                </DialogContent>
            </Dialog>
          );
        },
    },
]
