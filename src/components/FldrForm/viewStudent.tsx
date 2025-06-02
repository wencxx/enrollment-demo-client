import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { StudentCol } from "@/FldrTypes/types";
import { CardContent } from "@/components/ui/card";

interface StudentProps {
    toEdit?: string;
    onCancel?: () => void;
}

export function ViewStudent({ toEdit = "" }: StudentProps) {

  const [student, setStudent] = useState<StudentCol | null>(null);

  useEffect(() => {
    async function fetchData() {
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
