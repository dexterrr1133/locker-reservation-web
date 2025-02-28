import { FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
import { prepareLockerSizeData } from '@/app/actions/admin';

interface LockerChartProps {
  reservations: Reservation[];
}

export const LockerChart: FC<LockerChartProps> = ({ reservations }) => {
  const data = prepareLockerSizeData(reservations);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Locker Size Distribution</CardTitle>
        <CardDescription>Current Period</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="size" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_COLORS.active} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Distribution of locker sizes across all reservations
        </div>
      </CardFooter>
    </Card>
  );
};