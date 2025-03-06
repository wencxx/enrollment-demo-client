import {
    ChartConfig,
  } from "@/components/ui/chart"


export const lineConfig = {
    regular: {
      label: "Regular",
      color: "hsl(var(--chart-1))",
    },
    irregular: {
      label: "Irregular",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig