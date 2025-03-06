import { CartesianGrid, Bar, BarChart, XAxis} from "recharts"
import { StudentsCount } from "@/FldrTypes/students-count"
import { lineConfig } from './config'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


export default function BarChartComponent({ dataChart }: { dataChart: StudentsCount[] }){
    return (
        <>
            <ChartContainer config={lineConfig}>
                <BarChart
                  accessibilityLayer
                  data={dataChart}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="regular"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="irregular"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                  />
                </BarChart>
            </ChartContainer>
        </>
    )
}