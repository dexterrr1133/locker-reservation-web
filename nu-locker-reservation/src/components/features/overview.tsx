'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Loader2,
  TrendingUp,
  Users,
  DollarSign,
  BoxIcon
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/services/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Timestamp;
}

interface Reservation {
  id: string;
  createdAt: Timestamp;
  status: string;
  totalPrice: number;
  lockerSize: string;
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444'];

const AnalyticsDashboard: FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(usersData);

      // Fetch reservations
      const reservationsRef = collection(db, 'reservations');
      const reservationsQuery = query(reservationsRef, orderBy('createdAt', 'desc'));
      const reservationsSnapshot = await getDocs(reservationsQuery);
      const reservationsData = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      setReservations(reservationsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeData = (days: number) => {
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - days));
    return { startDate };
  };

  const prepareGrowthData = () => {
    const { startDate } = getDateRangeData(timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90);
    
    const filteredReservations = reservations.filter(
      r => r.createdAt.toDate() >= startDate
    );

    const dailyData = new Map();
    filteredReservations.forEach(reservation => {
      const date = reservation.createdAt.toDate().toLocaleDateString();
      const current = dailyData.get(date) || { date, revenue: 0, bookings: 0 };
      current.revenue += reservation.totalPrice;
      current.bookings += 1;
      dailyData.set(date, current);
    });

    return Array.from(dailyData.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const prepareStatusData = () => {
    const statusCount = reservations.reduce((acc, reservation) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const prepareLockerSizeData = () => {
    const sizeCount = reservations.reduce((acc, reservation) => {
      acc[reservation.lockerSize] = (acc[reservation.lockerSize] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sizeCount).map(([size, count]) => ({
      size,
      count
    }));
  };

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

  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const activeReservations = reservations.filter(r => r.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      {/* Overview Stats */}
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

      {/* Charts */}
      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth & Revenue</TabsTrigger>
          <TabsTrigger value="status">Reservation Status</TabsTrigger>
          <TabsTrigger value="lockers">Locker Distribution</TabsTrigger>
        </TabsList>

        <div className="grid gap-4 grid-cols-1">
          <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Analytics Overview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-3 py-1 rounded ${
                    timeframe === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeframe('30d')}
                  className={`px-3 py-1 rounded ${
                    timeframe === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  30D
                </button>
                <button
                  onClick={() => setTimeframe('90d')}
                  className={`px-3 py-1 rounded ${
                    timeframe === '90d' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  90D
                </button>
              </div>
            </div>

            <TabsContent value="growth" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareGrowthData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#22c55e"
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="status" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareStatusData()}
                    innerRadius={60}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {prepareStatusData().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="lockers" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareLockerSizeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;