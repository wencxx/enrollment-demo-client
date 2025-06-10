import { ArrowUpDown, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Enrollment2Col } from "@/FldrTypes/types"
import { DataTable } from "./data-table";
import { Enrollment2Form } from "../FldrForm/entryenrollment2";

interface TableProps {
  data: Enrollment2Col[];
  loading?: boolean;
  onRefresh: () => void;
}

export const Enrollment2Table: React.FC<TableProps> = ({ data, loading, onRefresh }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: ColumnDef<Enrollment2Col>[] = [
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
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "yearDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Year
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "courseDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Course
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "sectionDesc",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Section
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = {
          pkCode: row.original.pkCode,
          firstName: row.original.firstName,
          middleName: row.original.middleName || "",
          lastName: row.original.lastName,
          fullName: row.original.fullName,
          courseDesc: row.original.courseDesc,
          courseCode: row.original.courseCode,
          yearDesc: row.original.yearDesc,
          yearCode: row.original.yearCode,
          sectionDesc: row.original.sectionDesc
        };

        return (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Load</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[70dvw] lg:!max-w-[60dvw]">
            <DialogHeader>
              <DialogTitle>Load Subjects for {student.fullName}</DialogTitle>
            </DialogHeader>
            <Enrollment2Form 
              onSubmitSuccess={() => {
                setIsDialogOpen(false);
                if (onRefresh) onRefresh();
              }} 
              onAddRate={() => {
                if (onRefresh) onRefresh();
              }} 
              preselectedStudent={student}
            />
          </DialogContent>
        </Dialog>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      title="Enrollment 2"
      onRefresh={onRefresh}
    />
  );
};
