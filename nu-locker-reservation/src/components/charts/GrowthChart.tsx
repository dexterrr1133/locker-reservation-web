import { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CHART_COLORS } from './chartConfig';
import { Reservation } from '@/app/types/lockers';
import { prepareGrowthData } from '@/app/actions/admin';
interface GrowthChartProps {
  reservations: Reservation[];
  days: number;
  timeframe: string;
}

export const GrowthChart: FC<GrowthChartProps> = ({ reservations, days, timeframe }) => {
  const data = prepareGrowthData(reservations, days);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth & Revenue</CardTitle>
        <CardDescription>{timeframe.toUpperCase()} Overview</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke={CHART_COLORS.active}
              name="Revenue ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              stroke={CHART_COLORS.completed}
              name="Bookings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex items-center gap-2 font-medium">
          <TrendingUp className="h-4 w-4" />
          Revenue trend for the selected period
        </div>
        <div className="text-sm text-muted-foreground">
          Showing data for the last {days} days
        </div>
      </CardFooter>
    </Card>
  );
};