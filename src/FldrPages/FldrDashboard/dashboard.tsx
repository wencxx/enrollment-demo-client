import { UserCheck, UserPen, User } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ChartMain } from "@/components/Fldrcharts/chart-main";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { useEffect, useState } from "react";

function Dashboard() {
    const [studentCount, setStudentCount] = useState({
        applicant: 0,
        irregular: 0,
        regular: 0,
    });
    const [studentsCount, setStudentsCount] = useState([]);
    const [yearComparison, setYearComparison] = useState({
        regularChange: 0,
        irregularChange: 0
    })

    const fetchCount = async () => {
        try {
            const applicant = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/StudentCount/1`);
            const irregular = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/StatusCount/0`, {
                params: { validated: 1 }
            });
            const regular = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/StatusCount/1`, {
                params: { validated: 1 }
            });
            setStudentCount({
                applicant: applicant.data,
                irregular: irregular.data,
                regular: regular.data,
            })
        } catch (error) {
            console.error("Error fetching student count:", error);
        }
    };

    const fetchStudentStats = async () => {
        try {
            const response = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/StatusCountChart`);

            const formattedData = response.data.map((item: any) => ({
                year: item?.year ?? 0,
                regular: item?.regular ?? 0,
                irregular: item?.irregular ?? 0,
            }));
            setStudentsCount(formattedData);
        } catch (error) {
            console.error("Error fetching student stats:", error);
        }
    };

    useEffect(() => {
        fetchCount();
        fetchStudentStats();
    }, []);


    useEffect(() => {
        console.log("Data passed to ChartMain:", studentsCount);
    }, [studentsCount]);

    const cardData = [
        {
            title: 'Applicants',
            icon: UserPen,
            data: studentCount.applicant
        },
        {
            title: 'Enrolled students',
            icon: UserCheck,
            data: studentCount.regular + studentCount.irregular
        },
        {
            title: 'Regular students',
            icon: User,
            data: studentCount.regular
        },
        {
            title: 'Irregular students',
            icon: User,
            data: studentCount.irregular
        }
    ]

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cardData.map((card, index) => (
                        <Card key={index} className="h-fit rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold capitalize">{card.title}</span>
                                <card.icon />
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold">+{card.data}</h4>
                                <p className="text-sm font-semibold text-neutral-700">+20% from last year</p>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <Card className="min-h-[60dvh] rounded-xl md:min-h-min">
                        <ChartMain chartData={studentsCount} title="Number of students categorized by status" />
                    </Card>
                    <Card className="min-h-[60dvh] rounded-xl md:min-h-min">
                        <ChartMain chartData={studentsCount} defaultChart={'bar'} title="Number of students categorized by gender" />
                    </Card>
                </div>
            </div>
        </>
    );
}
export default Dashboard;