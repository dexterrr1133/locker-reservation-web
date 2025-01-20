import { ChartConfig } from "@/components/ui/chart";

export const statusChartConfig = {
  value: {
    label: "Count",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-3))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export const CHART_COLORS = {
  active: "hsl(var(--chart-1))",
  pending: "hsl(var(--chart-2))",
  completed: "hsl(var(--chart-3))",
  cancelled: "hsl(var(--chart-4))",
};