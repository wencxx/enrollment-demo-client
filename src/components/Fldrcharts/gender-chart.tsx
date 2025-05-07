import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { lineConfig } from "./config";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface ChartData {
  year: string;
  yearDesc: string;
  male: number;
  female: number;
  other: number;
}

const GenderChart = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="p-4">
      <ChartContainer config={lineConfig}>
        <BarChart
        accessibilityLayer
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
                    type="monotone"
                    fill="var(--color-regular)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="female"
                    type="monotone"
                    fill="var(--color-irregular)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="other"
                    type="monotone"
                    fill="var(--color-other)"
                    strokeWidth={2}
                  />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default GenderChart;