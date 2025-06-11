import { ArrowUpDown, Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Enrollment1Col } from "@/FldrTypes/types"
import { DataTable } from "./data-table";
import { ViewEnrollment1Form } from "../FldrForm/viewEnrollment1";

interface TableProps {
  data: Enrollment1Col[];
  loading?: boolean;
  onRefresh: () => void;
}

export const ApprovedEnrollmentsTable: React.FC<TableProps> = ({ data, loading, onRefresh }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pkCode, setPKCode] = useState("");

  const columns: ColumnDef<Enrollment1Col>[] = [
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
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "pkedDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Enrollment
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
        <Dialog open={isDialogOpen && pkCode === row.original.pkCode} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                setPKCode(row.original.pkCode);
                setIsDialogOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-h-[90vh] overflow-y-auto md:!max-w-[90dvw] lg:!max-w-[80dvw] scrollbar-hidden"
            aria-labelledby="dialog-title"
          >
            <ViewEnrollment1Form 
                toEdit={pkCode} 
                onCancel={() => {
                setIsDialogOpen(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      title="all enrollments"
      onRefresh={onRefresh}
    />
  );
};
