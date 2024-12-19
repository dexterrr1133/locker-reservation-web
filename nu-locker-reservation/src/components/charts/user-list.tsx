"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "July", newSignUps: 305 },
  { month: "August", newSignUps: 237 },
  { month: "September", newSignUps: 73 },
  { month: "October", newSignUps: 209 },
  { month: "November", newSignUps: 214 },
  { month: "December", newSignUps: 329 },
];

const chartConfig = {
  newSignUps: {
    label: "New Sign-Ups",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function UserSignUps() {
  return (
    <div className="relative block">
      <span className="absolute inset-0 bg-black"></span>
      <div className="relative flex h-full transform items-center border border-black bg-white transition-transform -translate-x-2 -translate-y-2">
        <Card className="border-none w-full">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>July - December 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="newSignUps" fill="var(--charts-3)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-black"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm text-black">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none">
              Mukanf burat
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}