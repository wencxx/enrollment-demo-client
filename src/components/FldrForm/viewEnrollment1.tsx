import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Enrollment1Col, EnrollDescCol, StudentCol } from "@/FldrTypes/kim-types";

interface Props {
  toEdit: string;
  onCancel?: () => void;
}

export function ViewEnrollment1Form({ toEdit, onCancel }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState<StudentCol | null>(null);
  const [enrollDesc, setEnrollDesc] = useState<EnrollDescCol | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<Enrollment1Col | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }

    if (toEdit) fetchData();
  }, [toEdit]);

  const displayValue = (value?: string | boolean) =>
    value === undefined || value === null ? "-" : value.toString();

  return (
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
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
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
              <p className="text-lg font-medium">{displayValue(enrollDesc?.aYearDesc)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Regular</h3>
              <p className="text-lg font-medium">{enrollmentData?.regularStudent ? "Yes" : "No"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-lg font-medium">{enrollmentData?.approveStudent ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="secondary" onClick={onCancel}>Close</Button>
          </div>
        </CardContent>
    </div>
  );
}
