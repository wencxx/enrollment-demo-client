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
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {student
                  ? `${student.firstName} ${student.middleName || ""} ${student.lastName} ${student.suffix || ""}`.replace(/\s+/g, " ").trim()
                  : "-"}
              </h2>
              <div className="text-gray-500 text-sm">
                Student Code: <span className="font-mono">{displayValue(student?.studentCode)}</span>
              </div>
              <div className="text-gray-500 text-sm">
                Student ID: <span className="font-mono">{displayValue(student?.studentID)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-start md:items-end">
              <span className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background:
                    student?.enrollStatusCode === "1"
                      ? "#fbbf24"
                      : student?.enrollStatusCode === "2"
                      ? "#4ade80"
                      : "#f87171",
                  color: "#222"
                }}>
                {student?.enrollStatusCode === "1"
                  ? "Pending"
                  : student?.enrollStatusCode === "2"
                  ? "Approved"
                  : "Disapproved"}
              </span>
              <span className="text-xs text-gray-500">
                Gender: {student?.genderCode === "1"
                  ? "Male"
                  : student?.genderCode === "2"
                  ? "Female"
                  : "Other"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border p-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact No.</h3>
              <p className="text-lg font-medium">{displayValue(student?.contactNo)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="text-lg font-medium">{displayValue(student?.emailAddress)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Birth Date</h3>
              <p className="text-lg font-medium">{displayValue(student?.birthDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="text-lg font-medium">{displayValue(student?.address)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">User Code</h3>
              <p className="text-lg font-medium">{displayValue(student?.userCode)}</p>
            </div>
          </div>
        </CardContent>
      </div>
    </>
  );
}
