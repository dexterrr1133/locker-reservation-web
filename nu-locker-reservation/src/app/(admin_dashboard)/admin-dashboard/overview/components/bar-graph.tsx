'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'Locker Usage Statistics';

const chartData = [
  // Sample data showing occupied and available lockers over time
  { date: '2024-04-01', occupied: 45, available: 55 },
  { date: '2024-04-02', occupied: 52, available: 48 },
  { date: '2024-04-03', occupied: 60, available: 40 },
  { date: '2024-04-04', occupied: 58, available: 42 },
  { date: '2024-04-05', occupied: 65, available: 35 },
  { date: '2024-04-06', occupied: 70, available: 30 },
  { date: '2024-04-07', occupied: 68, available: 32 },
  { date: '2024-04-08', occupied: 72, available: 28 },
  { date: '2024-04-09', occupied: 75, available: 25 },
  { date: '2024-04-10', occupied: 80, available: 20 },
  { date: '2024-04-11', occupied: 78, available: 22 },
  { date: '2024-04-12', occupied: 85, available: 15 },
  { date: '2024-04-13', occupied: 82, available: 18 },
  { date: '2024-04-14', occupied: 88, available: 12 },
  { date: '2024-04-15', occupied: 90, available: 10 },
  // Add more dates as needed
];

const chartConfig = {
  views: {
    label: 'Locker Status'
  },
  occupied: {
    label: 'Occupied',
    color: 'hsl(var(--chart-1))'
  },
  available: {
    label: 'Available',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] = 
    React.useState<keyof typeof chartConfig>('occupied');

  const total = React.useMemo(
    () => ({
      occupied: chartData.reduce((acc, curr) => acc + curr.occupied, 0),
      available: chartData.reduce((acc, curr) => acc + curr.available, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Locker Usage Statistics</CardTitle>
          <CardDescription>
            Showing locker occupancy trends over time
          </CardDescription>
        </div>
        <div className="flex">
          {['occupied', 'available'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}