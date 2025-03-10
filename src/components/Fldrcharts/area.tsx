import { CartesianGrid, Area, AreaChart, XAxis} from "recharts"
import { StudentsCount } from "@/FldrTypes/students-count"
import { lineConfig } from './config'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


export default function AreaChartComponent({ dataChart }: { dataChart: StudentsCount[] }){
    return (
        <>
            <ChartContainer config={lineConfig}>
                <AreaChart
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
                  <Area
                    dataKey="validated"
                    type="monotone"
                    stroke="var(--color-regular)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="applicants"
                    type="monotone"
                    stroke="var(--color-irregular)"
                    strokeWidth={2}
                  />
                </AreaChart>
            </ChartContainer>
        </>
    )
}