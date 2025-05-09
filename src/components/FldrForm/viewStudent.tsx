import { useForm } from "react-hook-form";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    //   FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check } from "lucide-react";
import { EnrollDescCol, Enrollment1Col, StudentCol } from "@/FldrTypes/kim-types";
import { cn } from "@/lib/utils";
import { enrollment1Schema } from "@/FldrSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { CardContent } from "@/components/ui/card";

type StudentData = {
    studentCode: string;
    firstName: number;
    middleName: string;
    lastName: string;
    suffix: string;

    enrollStatusCode: string;
    enrollStatusDesc: string;
    genderCode: string;

    address: string;
    birthDate: string;
    contactNo: string;
    emailAddress: string;
    userCode: string;
}

interface StudentProps {
    toEdit?: string;
    onCancel?: () => void;
}

export function ViewStudent({ toEdit = "" }: StudentProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState<StudentCol | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const studentRes = await axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`)

        const studentData = studentRes.data.find((e: StudentCol) => e.studentCode === toEdit);
        if (!studentData) {
          toast.error("Student data not found.");
          return;
        }

        setStudent(studentData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load enrollment details.");
      } finally {
        setIsLoading(false);
      }
    }
    if (toEdit) fetchData();
  }, [toEdit]);
  
    const displayValue = (value?: string | boolean) =>
      value === undefined || value === null ? "-" : value.toString();

  return (
    <>
      <div className="w-full mx-auto">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Student</h3>
                    <p className="text-lg font-medium">
                      {student ? `${student.firstName} ${student.middleName || ""} ${student.lastName} ${student.suffix || ""}`.trim() : "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Student Code</h3>
                    <p className="text-lg font-medium">{displayValue(student?.studentCode)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
                    <p className="text-lg font-medium">{displayValue(student?.birthDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Course</h3>
                    <p className="text-lg font-medium">{displayValue(student?.address)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Year</h3>
                    <p className="text-lg font-medium">{displayValue(student?.contactNo)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Semester</h3>
                    <p className="text-lg font-medium">{displayValue(student?.emailAddress)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                    <p className="text-lg font-medium">
                      {student?.genderCode === "1"
                        ? "Male"
                        : student?.genderCode === "2"
                        ? "Female"
                        : "Other"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Enrollment Status</h3>
                    <p className="text-lg font-medium">
                      {student?.enrollStatusCode === "1"
                        ? "Pending"
                        : student?.enrollStatusCode === "2"
                        ? "Approve"
                        : "Disapprove"}
                    </p>
                  </div>
                </div>
              </CardContent>
          </div>
    </>
  );
}
