import { UserCheck, UserPen, User } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ChartMain } from "@/components/Fldrcharts/chart-main";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { useEffect, useState } from "react";
import { AYCol } from "@/FldrTypes/kim-types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

function Dashboard() {
    const [academicYears, setAcademicYears] = useState<AYCol[]>([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [studentCount, setStudentCount] = useState({
        applicant: 0,
        enrolled: 0
    });
    const [enrolledCount, setEnrolledCount] = useState({
        irregular: 0,
        regular: 0,
    });
    // const [yearComparison, setYearComparison] = useState({
    //     regularChange: 0,
    //     irregularChange: 0
    // })

    useEffect(() => {
        const fetchCount = async () => {
          try {
            const response = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/GetCounts`, {
              params: { academicYear: selectedYear },
            });
      
            const { applicants, enrolled, regular, irregular } = response.data;
      
            setStudentCount({
              applicant: applicants,
              enrolled: enrolled,
            });
      
            setEnrolledCount({
              regular: regular,
              irregular: irregular,
            });
          } catch (error) {
            console.error("Error fetching filtered data:", error);
          }
        };
      
        if (selectedYear) {
          fetchCount();
        }
      }, [selectedYear]);

    const cardData = [
        {
            title: 'Applicants',
            icon: UserPen,
            data: studentCount.applicant
        },
        {
            title: 'Enrolled students',
            icon: UserCheck,
            data: studentCount.enrolled
        },
        {
            title: 'Regular students',
            icon: User,
            data: enrolledCount.regular
        },
        {
            title: 'Irregular students',
            icon: User,
            data: enrolledCount.irregular
        }
    ]

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const yearRes = await axios.get<AYCol[]>(`${plsConnect()}/API/WebAPI/ListController/ListAcademicYear`)
                const years = yearRes.data;
                
                setAcademicYears(years);
            } catch (error) {
                console.error("Error:", error)
            }
        }

        fetchAcademicYears();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-end mb-4">
                <Select 
                    value={selectedYear}
                    onValueChange={(value) => setSelectedYear(value)} // Use onValueChange for functionality
                    >
                    <SelectTrigger className="w-[180px] border rounded px-4 py-2">
                        <SelectValue placeholder="Select AY" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {academicYears.map((year) => (
                            <SelectItem key={year.aYearCode} value={year.aYearCode}>
                            {year.aYearDesc}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cardData.map((card) => (
                        <Card key={card.title} className="h-fit rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold capitalize">{card.title}</span>
                                <card.icon />
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold">{card.data}</h4>
                                {/* <p className="text-sm font-semibold text-neutral-700">+20% from last year</p> */}
                            </div>
                        </Card>
                    ))}
                </div>
                {/* <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <Card className="min-h-[60dvh] rounded-xl md:min-h-min">
                        <ChartMain chartData={studentsCount} title="Number of students categorized by status" />
                    </Card>
                    <Card className="min-h-[60dvh] rounded-xl md:min-h-min">
                        <ChartMain chartData={studentsCount} defaultChart={'bar'} title="Number of students categorized by gender" />
                    </Card>
                </div> */}
            </div>
        </>
    );
}
export default Dashboard;