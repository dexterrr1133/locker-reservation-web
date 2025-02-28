'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  TrendingUp,
  Users,
  DollarSign,
  BoxIcon,
} from 'lucide-react';

import {
  fetchUsers,
  fetchReservations,
  calculateTotalRevenue,
  getActiveReservations,
} from '@/app/actions/admin';
import { Reservation, TimeframeOption } from '@/app/types/lockers';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { StatusChart } from '@/components/charts/StatusChart';
import { LockerChart } from '@/components/charts/LockerChart';
import { User } from '@/app/types/user';


const AnalyticsDashboard: FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30d');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, reservationsData] = await Promise.all([
          fetchUsers(),
          fetchReservations()
        ]);
        setUsers(usersData);
        setReservations(reservationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  const totalRevenue = calculateTotalRevenue(reservations);
  const activeReservations = getActiveReservations(reservations);
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BoxIcon className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Active Lockers</h3>
              <p className="text-2xl font-bold">{activeReservations}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Bookings</h3>
              <p className="text-2xl font-bold">{reservations.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth & Revenue</TabsTrigger>
          <TabsTrigger value="status">Reservation Status</TabsTrigger>
          <TabsTrigger value="lockers">Locker Distribution</TabsTrigger>
        </TabsList>

        <div className="grid gap-4 grid-cols-1">
          <TabsContent value="growth">
            <GrowthChart 
              reservations={reservations}
              days={days}
              timeframe={timeframe}
            />
          </TabsContent>

          <TabsContent value="status">
            <StatusChart reservations={reservations} />
          </TabsContent>

          <TabsContent value="lockers">
            <LockerChart reservations={reservations} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-end gap-2">
        {(['7d', '30d', '90d'] as TimeframeOption[]).map((option) => (
          <button
            key={option}
            onClick={() => setTimeframe(option)}
            className={`px-3 py-1 rounded ${
              timeframe === option ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;