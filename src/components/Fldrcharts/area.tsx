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
                    dataKey="regular"
                    type="monotone"
                    stroke="var(--color-regular)"
                    fill="var(--color-regular)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="irregular"
                    type="monotone"
                    stroke="var(--color-irregular)"
                    fill="var(--color-irregular)"
                    strokeWidth={2}
                  />
                </AreaChart>
            </ChartContainer>
        </>
    )
}