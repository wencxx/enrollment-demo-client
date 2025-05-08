import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { lineConfig } from "./config";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChartData {
  year: string;
  yearDesc: string;
  male: number;
  female: number;
  other: number;
}

const GenderChart = ({ data }: { data: ChartData[] }) => {
  const [chartType, setChartType] = useState<string>("bar");
  return (
    <Card className="min-h-[60dvh] rounded-xl md:min-h-min pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row p-4">
              <CardTitle>
              <span>Gender</span>
              </CardTitle>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Select chart" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="bar" className="rounded-lg">
                    Bar
                  </SelectItem>
                  <SelectItem value="area" className="rounded-lg">
                    Area
                  </SelectItem>
                </SelectContent>
              </Select>
          </CardHeader>
          <div className="p-4">
            <ChartContainer config={lineConfig}>
            {chartType === "area" ? (
                <AreaChart
                  data={data}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="yearDesc"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Area
                    dataKey="male"
                    type="natural"
                    fill="var(--color-regular)"
                    fillOpacity={0.4}
                    stroke="var(--color-regular)"
                    stackId="a"
                  />
                  <Area
                    dataKey="female"
                    type="natural"
                    fill="var(--color-irregular)"
                    fillOpacity={0.4}
                    stroke="var(--color-irregular)"
                    stackId="b"
                  />
                  <Area
                    dataKey="other"
                    type="natural"
                    fill="var(--color-other)"
                    fillOpacity={0.4}
                    stroke="var(--color-other)"
                    stackId="c"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={data}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="yearDesc"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="male"
                    fill="var(--color-regular)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="female"
                    fill="var(--color-irregular)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="other"
                    fill="var(--color-other)"
                    strokeWidth={2}
                  />
                </BarChart>
              )}
            </ChartContainer>
          </div>
    </Card>
    
  );
};

export default GenderChart;