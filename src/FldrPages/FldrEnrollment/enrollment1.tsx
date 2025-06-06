import { useState, useEffect } from "react";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { ApprovedEnrollmentsTable } from "@/components/FldrDatatable/enrollment1approved-columns";
import { AllStudentsTable } from "@/components/FldrDatatable/enrollment1allstudents-columns";
import { ApplicantsTable } from "@/components/FldrDatatable/enrollment1pending-columns";
import { Enrollment1Col, StudentCol } from "@/FldrTypes/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Enrollment1() {
  const [approved, setApproved] = useState<Enrollment1Col[]>([]);
  const [allStudents, setAllStudents] = useState<StudentCol[]>([]);
  const [oldStudents, setOldStudents] = useState<StudentCol[]>([]);
  const [pending, setPending] = useState<StudentCol[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
  
      const allRes = await axios.get<StudentCol[]>(
        `${plsConnect()}/API/WebAPI/StudentController/ListStudent`
      );
      const allData = allRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${
          item.middleName ? item.middleName + " " : ""
        }${item.lastName}${item.suffix ? " " + item.suffix : ""}`,
      }));
      setAllStudents(allData);

      const oldRes = await axios.get<StudentCol[]>(
        `${plsConnect()}/API/WebAPI/StudentController/ListContinuingStudent`
      );
      const oldData = oldRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${
          item.middleName ? item.middleName + " " : ""
        }${item.lastName}${item.suffix ? " " + item.suffix : ""}`,
      }));
      setOldStudents(oldData);

      const pendingRes = await axios.get<StudentCol[]>(
        `${plsConnect()}/API/WebAPI/StudentController/ListNewStudent`
      );
      const pendingData = pendingRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${
          item.middleName ? item.middleName + " " : ""
        }${item.lastName}${item.suffix ? " " + item.suffix : ""}`,
      }));
      setPending(pendingData);

      const approvedRes = await axios.get<Enrollment1Col[]>(
        `${plsConnect()}/API/WEBAPI/Enrollment1Controller/ListEnrollment1`
      );
      const approvedData = approvedRes.data.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${
          item.middleName ? item.middleName + " " : ""
        }${item.lastName}${item.suffix ? " " + item.suffix : ""}`,
        pkedDesc: `${item.courseDesc} - ${item.yearDesc} - ${item.semDesc} - ${item.sectionDesc} (${item.ayStart}-${item.ayEnd})`,
      }));
      setApproved(approvedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="container py-6">
        <div className="space-x-2">
          <Tabs defaultValue="pending" className="w-[full]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending" className="relative">
                Applicants
                {pending.length > 0 && (
                  <Badge
                    className="ml-2 bg-blue-100 text-blue-700"
                    variant="outline"
                  >
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="old" className="relative">
                Continuing
                {oldStudents.length > 0 && (
                  <Badge
                    className="ml-2 bg-blue-100 text-blue-700"
                    variant="outline"
                  >
                    {oldStudents.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="allStudents" className="relative">
                All
                {allStudents.length > 0 && (
                  <Badge
                    className="ml-2 bg-blue-100 text-blue-700"
                    variant="outline"
                  >
                    {allStudents.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="approved" className="relative">
                Approved Enrollments
                {approved.length > 0 && (
                  <Badge
                    className="ml-2 bg-blue-100 text-blue-700"
                    variant="outline"
                  >
                    {approved.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <div className="mt-4">
                <ApplicantsTable data={pending} loading={loading} onRefresh={getData} />
              </div>
            </TabsContent>
            <TabsContent value="old">
              <div className="mt-4">
                <AllStudentsTable data={oldStudents} loading={loading} onRefresh={getData} />
              </div>
            </TabsContent>
            <TabsContent value="allStudents">
              <div className="mt-4">
                <AllStudentsTable data={allStudents} loading={loading} onRefresh={getData} />
              </div>
            </TabsContent>
            <TabsContent value="approved">
              <div className="mt-4">
                <ApprovedEnrollmentsTable data={approved} loading={loading} onRefresh={getData} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
