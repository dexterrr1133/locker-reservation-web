import { FC, useMemo } from 'react';
import { PieChart, Pie, Label } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { statusChartConfig } from './chartConfig';
import { Reservation } from '@/app/types/lockers';
import { prepareStatusData, getActiveReservations } from '@/app/actions/admin';

interface StatusChartProps {
  reservations: Reservation[];
}

export const StatusChart: FC<StatusChartProps> = ({ reservations }) => {
  const statusData = useMemo(() => prepareStatusData(reservations), [reservations]);
  const totalReservations = useMemo(() => reservations.length, [reservations]);
  const activeReservations = useMemo(() => getActiveReservations(reservations), [reservations]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Reservation Status Distribution</CardTitle>
        <CardDescription>Current Period</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={statusChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReservations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {activeReservations} active reservations
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current reservation status distribution
        </div>
      </CardFooter>
    </Card>
  );
};