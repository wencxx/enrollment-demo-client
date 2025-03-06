import { useState } from "react";
import { StudentsCount } from "@/FldrTypes/students-count"
import LineChartComponent from "./line";
import BarChartComponent from "./bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartType = [
  {
    type: "line",
    label: "Line Chart",
  },
  {
    type: "bar",
    label: "Bar Chart",
  }
];

export function ChartMain({ chartData }: { chartData: StudentsCount[] }) {
  const [selectedChartType, setSelectedChartType] = useState(chartType[0].type);

  const handleChartTypeChange = (type: string) => {
    setSelectedChartType(type);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Number of students</span>
          <Select onValueChange={handleChartTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              {chartType.map((chart, index) => (
                <SelectItem key={index} value={chart.type}>{chart.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
          {selectedChartType === "line" ? (
            <LineChartComponent dataChart={chartData} />
          ) : (
            <BarChartComponent dataChart={chartData} />
          )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {/* <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div> */}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total students for last years.
            </div>
          </div>
        </div>
      </CardFooter>
    </>
  )
}
