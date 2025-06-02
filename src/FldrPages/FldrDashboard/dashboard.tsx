import { UserCheck, UserPen, User } from "lucide-react";
import { Card } from "@/components/ui/card"
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { useEffect, useState } from "react";
import { AYCol } from "@/FldrTypes/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import RegularChart from "@/components/Fldrcharts/regular-chart";
import GenderChart from "@/components/Fldrcharts/gender-chart";

function Dashboard() {
    // to populate kay wala ta "current year"
    const defaultYear = "001";

    const [academicYears, setAcademicYears] = useState<AYCol[]>([]);
    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const [studentCount, setStudentCount] = useState({
        applicant: 0,
        enrolled: 0
    });
    const [enrolledCount, setEnrolledCount] = useState({
        irregular: 0,
        regular: 0,
    });

    // const [regChartData, setRegChartData] = useState<
    //     { year: string; yearDesc: string; regular: number; irregular: number }[]
    // >([]);
    // const [genderChartData, setGenderChartData] = useState<
    //     { year: string; yearDesc: string; male: number; female: number; other: number; }[]
    // >([]);


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

    // const fetchChartData = async (startYear: string, endYear: string) => {
    //     try {
    //       const responseReg = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/GetRegularData`, {
    //         params: { startYear, endYear },
    //       });
    //       const regData = responseReg.data;
    //       setRegChartData(regData);

    //       const responseGender = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/GetGenderData`, {
    //         params: { startYear, endYear },
    //       });
    //       const genderData = responseGender.data;
    //       setGenderChartData(genderData);
    //     } catch (error) {
    //       console.error("Error fetching chart data:", error);
    //     }
    //   };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex">
                <Select 
                    value={selectedYear}
                    onValueChange={(value) => setSelectedYear(value)}
                    >
                    <SelectTrigger className="w-[180px] border rounded px-4 py-2">
                        <SelectValue placeholder="Select AY" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {academicYears.map((year) => (
                            <SelectItem key={year.ayCode} value={year.ayCode}>
                            {year.ayStart}-{year.ayEnd}
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
                            </div>
                        </Card>
                    ))}
                </div>
                {/* <div className="flex items-center gap-4">
                        <h3 className="text-sm font-medium text-gray-500">From</h3>
                        <Select
                            value={startYear}
                            onValueChange={(value) => setStartYear(value)}
                        >
                            <SelectTrigger className="w-[30] border rounded px-4 py-2">
                            <SelectValue placeholder="Start AY" />
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
                        <h3 className="text-sm font-medium text-gray-500">To</h3>
                        <Select
                            value={endYear}
                            onValueChange={(value) => setEndYear(value)}
                        >
                            <SelectTrigger className="w-[30] border rounded px-4 py-2">
                            <SelectValue placeholder="End AY" />
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
                </div> */}
                
                {/* <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <RegularChart data={regChartData} />
                    <GenderChart data={genderChartData} />
                </div> */}
            </div> 
        </>
    );
}
export default Dashboard;