import { UserCheck, UserPen, User } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ChartMain } from "@/components/Fldrcharts/chart-main";

// interface cardData = 

function Dashboard() {
    const cardData = [
        {
            title: 'Applicants',
            icon: UserPen,
            data: 1000
        },
        {
            title: 'Enrolled students',
            icon: UserCheck,
            data: 3000
        },
        {
            title: 'Regular students',
            icon: User,
            data: 2500
        },
        {
            title: 'Irregular students',
            icon: User,
            data: 500
        }
    ]

    const studentsCount = [
        { year: 2021, regular: 100, irregular: 150 },
        { year: 2022, regular: 286, irregular: 100 },
        { year: 2023, regular: 150, irregular: 200 },
        { year: 2024, regular: 305, irregular: 200 },
        { year: 2025, regular: 237, irregular: 120 },
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