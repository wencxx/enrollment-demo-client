import { UserCheck, UserPen, User } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ChartMain } from "@/components/Fldrcharts/chart-main";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { useEffect, useState } from "react";

// interface cardData = 

function Dashboard() {
    const [studentCount, setStudentCount] = useState({
        applicant: 0,
        student: 0,
        // validated: 0,
});
    const [studentsCount, setStudentsCount] = useState([]);

    useEffect(() => { 
        const fetchCount = async () => {
            try {
                const applicant = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/StudentCount/1`);
                const student = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/StudentCount/2`);
                // const validated = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/ValidatedCounts/2`);
                setStudentCount({
                    applicant: applicant.data,
                    student: student.data,
                    // validated: validated.data,
                })
                console.log("Applicant:", applicant.data);
                console.log("Student:", student.data);
                // console.log("Validated:", validated.data);
            } catch (error) {
                console.error("Error fetching student count:", error);
            }
        };

        const fetchStudentStats = async () => {
            try {
                const response = await axios.get(`${plsConnect()}/API/WebAPI/VariousController/ValidatedCounts/2`);
                const formattedData = response.data.map((item: 
                    { year: number; validated: number }) => ({
                    year: item.year,
                    validated: item.validated, 
                }));
                setStudentsCount(formattedData);
            } catch (error) {
                console.error("Error fetching student stats:", error);
            }
        };
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
            data: studentCount.student
        },
        {
            title: 'Regular students',
            icon: User,//
            data: 2500
        },
        {
            title: 'Irregular students',
            icon: User,
            data: 500
        }
    ]

    return ( 
        <>
            <div className="flex flex-col gap-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cardData.map((card, index) => (
                        <Card key={index} className="h-fit rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold capitalize">{ card.title }</span>
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
                        <ChartMain chartData={studentsCount} />
                        
                    </Card>
                    <Card className="min-h-[60dvh] rounded-xl md:min-h-min">
                        <ChartMain chartData={studentsCount} defaultChart={'bar'} />
                    </Card>
                </div>
            </div>
        </>
     );
}
export default Dashboard;