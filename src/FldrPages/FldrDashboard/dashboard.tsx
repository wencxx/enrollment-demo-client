import { UserCheck, UserPen, User } from "lucide-react";
import { Card } from "@/components/ui/card"

function Dashboard() {
    const cardData = [
        {
            title: 'Enrolled Students',
            icon: UserCheck,
            data: 3000
        },
        {
            title: 'Applicant',
            icon: UserPen,
            data: 1000
        },
        {
            title: 'Regular',
            icon: User,
            data: 2500
        },
        {
            title: 'Irregular',
            icon: User,
            data: 500
        }
    ]

    return ( 
        <>
            <div className="flex flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {cardData.map((card, index) => (
                        <Card key={index} className="h-fit rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{ card.title }</span>
                                <card.icon />
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold">+{card.data}</h4>
                                <p className="text-sm font-semibold text-neutral-700">+20% from last year</p>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card className="h-[60dvh] rounded-xl md:min-h-min" />
                    <Card className="h-[60dvh] rounded-xl md:min-h-min" />
                </div>
                
            </div>
        </>
     );
}
export default Dashboard;