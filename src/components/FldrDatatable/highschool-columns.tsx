import { Edit, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HighSchoolCol } from "@/FldrTypes/types";
import { DataTable } from "./data-table";
import { HighSchoolForm } from "../FldrForm/entryhighschool";

interface HighSchoolTableProps {
  data: HighSchoolCol[];
  loading?: boolean;
  onRefresh: () => void;
}

export const HighSchoolTable: React.FC<HighSchoolTableProps> = ({ data, loading, onRefresh }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hsCode, setHSCode] = useState("");

  const columns: ColumnDef<HighSchoolCol>[] = [
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
        accessorKey: "hsCode",
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
        accessorKey: "hsDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Dialog open={isDialogOpen && hsCode === row.original.hsCode} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                setHSCode(row.original.hsCode);
                setIsDialogOpen(true);
              }}
            >
              <span className="sr-only">Edit high school</span>
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-h-[90vh] overflow-y-auto md:!max-w-[90dvw] lg:!max-w-[80dvw] scrollbar-hidden"
            aria-labelledby="dialog-title"
          >
            <HighSchoolForm 
                editMode={true}
                toEdit={hsCode} 
                onCancel={() => {
                setIsDialogOpen(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      title="high school"
      onRefresh={onRefresh}
    />
  );
};
