import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { lineConfig } from "./config";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface ChartData {
  year: string;
  regular: number;
  irregular: number;
}

const RegularChart = ({ data }: { data: ChartData[] }) => {
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
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
        />
          <YAxis />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="regular"
                    type="monotone"
                    fill="var(--color-regular)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="irregular"
                    type="monotone"
                    fill="var(--color-irregular)"
                    strokeWidth={2}
                  />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default RegularChart;