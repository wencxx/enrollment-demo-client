import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { Eye, ArrowUpDown, FileSpreadsheet, Stamp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge"
import moment from 'moment'
import { EditStudent } from "../FldrForm/editstudent"
import { studentProfile } from "@/FldrTypes/enrollment1"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"  
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTrigger,
    DialogTitle,
    DialogHeader
  } from "@/components/ui/dialog"
import { EditGrades } from "../FldrForm/editgrades"
import { NewSemEnrollment1Form } from "../FldrForm/entryNewSemEnrollment1"

export const columns: ColumnDef<studentProfile>[] = [
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
        accessorKey: "studentID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Student ID
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
        accessorKey: "birthDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Birth Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const birthDate = row.getValue("birthDate");

            let dateObject: Date;

            if (birthDate instanceof Date) {
                dateObject = birthDate;
            } else if (typeof birthDate === "string" || typeof birthDate === "number") {
                dateObject = new Date(birthDate);
            } else {
                return "No birthdate";
            }

            if (!isNaN(dateObject.getTime())) {
                return moment(format(dateObject, "yyyy-MM-dd")).format('ll');
            }

            return "N/A";
        },

    },
    {
        accessorKey: "address",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Address
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
        cell: ({ row }) => {
            let variantType: 'approve' | 'disapprove' | 'pending' = 'pending';
            
            const status: string = row.getValue("enrollStatusCode")
  
            // Apply color logic based on the status value
            if (status === 'Approve') {
              variantType = 'approve';
            } else if (status === 'Disapprove') {
              variantType = 'disapprove';
            } else if (status === 'Pending') {
              variantType = 'pending';
            }
  
            return (
              <div className="flex">
                  <Badge variant={variantType}>
                    {status}
                  </Badge>
              </div>
            );
          },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
            const [studentCode, setStudentCode] = useState("");
    
            const status = row.getValue("enrollStatusCode");
    
            const handleProfileDialog = (studentCode: string) => {
                console.log("Opening modal for student:", studentCode); 
                setStudentCode(studentCode);
                setTimeout(() => setIsProfileDialogOpen(true), 0);
            };
    
            const handleProfileUpdate = (updatedStudent: any) => {
                console.log("Updated student details:", updatedStudent);
                setIsProfileDialogOpen(false);
            };

            // grade modal
            const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);

            const handleGradeDialog = (studentCode: string) => {
                console.log("Opening grades for student:", studentCode); 
                setStudentCode(studentCode);
                setTimeout(() => setIsGradeDialogOpen(true), 0);
            };

            const [isNewSemDialogOpen, setIsNewSemDialogOpen] = useState(false);

            const handleDialogOpen = (studentCode: string) => {
                setStudentCode(studentCode);
                setIsNewSemDialogOpen(true);
            };
            
            const closeModal = () => {
                setIsNewSemDialogOpen(false)
              }


return (
    <>
    {status !== "Pending" && (
    <div>
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogTrigger asChild>
                <TooltipProvider>
                <Tooltip>
                <TooltipTrigger>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleProfileDialog(row.original.studentCode)}>
                        <span className="sr-only">Open menu</span>
                        <Eye className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                    <TooltipContent>
                    <p>View and edit student details</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogHeader>
                    <DialogTitle className="mb-4">View Student Profile</DialogTitle>
                </DialogHeader>
                <EditStudent studentCode={studentCode} onSubmitSuccess={handleProfileUpdate} />
            </DialogContent>
        </Dialog>

    
    {/* enrollment1 modal */}
        <Dialog open={isNewSemDialogOpen} onOpenChange={setIsNewSemDialogOpen}>
            <DialogTrigger asChild>
            <TooltipProvider>
            <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDialogOpen(row.original.studentCode)}>
                <span className="sr-only">Open menu</span>
                <Stamp className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
                <TooltipContent>
                <p>Enroll in next semester</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogHeader>
                <DialogTitle className="mb-4">Continuing student enrollment</DialogTitle>
                <DialogDescription className="text-red-500">
                    Student details must be changed in previous step prior to enrollment.
                </DialogDescription>
                </DialogHeader>
                <NewSemEnrollment1Form studentCode={studentCode} closeModal={closeModal} />
            </DialogContent>
        </Dialog>

        {/* update grades modal */}
        <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
            <DialogTrigger asChild>
            <TooltipProvider>
            <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleGradeDialog(row.original.studentCode)}>
                    <span className="sr-only">Open menu</span>
                    <FileSpreadsheet className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
                <TooltipContent>
                <p>Grades</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto md:!max-w-[80dvw] lg:!max-w-[70dvw] scrollbar-hidden" aria-labelledby="dialog-title">
                <DialogHeader>
                    <DialogTitle className="mb-4">Update Grades</DialogTitle>
                </DialogHeader>
                <EditGrades studentCode={studentCode} />
            </DialogContent>
        </Dialog>
</div>
    )}
    
    </>
)
        },
    },
]
