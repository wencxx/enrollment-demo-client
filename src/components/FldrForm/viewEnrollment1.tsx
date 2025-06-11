import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Enrollment1Col, EnrollDescCol, StudentCol } from "@/FldrTypes/types";

interface Props {
  toEdit: string;
  onCancel?: () => void;
}

export function ViewEnrollment1Form({ toEdit, onCancel }: Props) {
  const [student, setStudent] = useState<StudentCol | null>(null);
  const [enrollDesc, setEnrollDesc] = useState<EnrollDescCol | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<Enrollment1Col | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, descRes, enrollRes] = await Promise.all([
          axios.get(`${plsConnect()}/API/WebAPI/StudentController/ListStudent`),
          axios.get(`${plsConnect()}/api/EnrollDescription`),
          axios.get(`${plsConnect()}/API/WEBAPI/Enrollment1Controller/ListEnrollment1`)
        ]);

        const enrollment = enrollRes.data.find((e: Enrollment1Col) => e.pkCode === toEdit);
        if (!enrollment) {
          toast.error("Enrollment data not found.");
          return;
        }

        const studentMatch = studentsRes.data.find((s: StudentCol) => s.studentCode === enrollment.studentCode);
        const descMatch = descRes.data.find((d: EnrollDescCol) => d.pkedCode === enrollment.pkedCode);

        setEnrollmentData(enrollment);
        setStudent(studentMatch || null);
        setEnrollDesc(descMatch || null);
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
    <div className="w-full mx-auto">
      <CardContent className="pt-6">
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
          </div>
          <div className="flex flex-col gap-1 items-start md:items-end">
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: enrollmentData?.regularStudent
                  ? "#4ade80"
                  : "#f87171",
                color: "#222"
              }}>
              {enrollmentData?.regularStudent ? "Regular" : "Irregular"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: enrollmentData?.approveStudent
                  ? "#4ade80"
                  : "#f87171",
                color: "#222"
              }}>
              {enrollmentData?.approveStudent ? "Approved" : "Not Approved"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border p-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
            <p className="text-lg font-medium">{displayValue(enrollmentData?.tDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Course</h3>
            <p className="text-lg font-medium">{displayValue(enrollDesc?.courseDesc)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Year</h3>
            <p className="text-lg font-medium">{displayValue(enrollDesc?.yearDesc)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Semester</h3>
            <p className="text-lg font-medium">{displayValue(enrollDesc?.semDesc)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Section</h3>
            <p className="text-lg font-medium">{displayValue(enrollDesc?.sectionDesc)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Academic Year</h3>
            <p className="text-lg font-medium">
              {enrollDesc ? `${enrollDesc.ayStart}-${enrollDesc.ayEnd}` : "-"}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={onCancel}>Close</Button>
        </div>
      </CardContent>
    </div>
  );
}
