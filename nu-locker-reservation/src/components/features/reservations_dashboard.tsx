'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  updateDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/services/firebase';

interface Reservation {
  id: string;
  createdAt: Timestamp;
  endDate: Timestamp;
  lockerNumber: string;
  lockerSize: string;
  startDate: Timestamp;
  status: string;
  totalPrice: number;
  updatedAt: Timestamp;
  userName: string;
}

type StatusFilter = 'all' | 'pending' | 'active' | 'completed' | 'cancelled';

const ReservationsDashboard: FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, statusFilter, searchTerm]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const reservationsRef = collection(db, 'reservations');
      const q = query(reservationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedReservations: Reservation[] = [];
      querySnapshot.forEach((doc) => {
        fetchedReservations.push({
          id: doc.id,
          ...doc.data() as Omit<Reservation, 'id'>
        });
      });

      setReservations(fetchedReservations);
      
      // Calculate statistics
      const newStats = fetchedReservations.reduce((acc, reservation) => {
        acc.total++;
        acc[reservation.status]++;
        acc.totalRevenue += reservation.totalPrice;
        return acc;
      }, {
        total: 0,
        pending: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
      });
      
      setStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching reservations');
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation => 
        reservation.userName.toLowerCase().includes(searchLower) ||
        reservation.lockerNumber.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredReservations(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600',
      active: 'text-green-600',
      completed: 'text-blue-600',
      cancelled: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className={getStatusColor(status)} />,
      active: <CheckCircle className={getStatusColor(status)} />,
      completed: <CheckCircle className={getStatusColor(status)} />,
      cancelled: <XCircle className={getStatusColor(status)} />,
    };
    return icons[status] || <Clock className={getStatusColor(status)} />;
  };

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      const updatedReservations = reservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: newStatus, updatedAt: Timestamp.now() }
          : reservation
      );
      setReservations(updatedReservations);
    } catch (err) {
      setError('Failed to update reservation status');
    }
  };

  const TabButton: FC<{ 
    active: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

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

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Reservations</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-yellow-600">Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-green-600">Active</h3>
          <p className="text-2xl font-bold">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-blue-600">Completed</h3>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-red-600">Cancelled</h3>
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-green-600">Total Revenue</h3>
          <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user name or locker number..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <span className="font-semibold my-auto w-20">Status:</span>
          <div className="flex gap-2">
            {(['all', 'pending', 'active', 'completed', 'cancelled'] as const).map((status) => (
              <TabButton
                key={status}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Reservations
          <span className="text-sm font-normal ml-2 text-gray-500">
            ({filteredReservations.length} reservations)
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Locker #</th>
                <th className="text-left p-2">Size</th>
                <th className="text-left p-2">Start Date</th>
                <th className="text-left p-2">End Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Last Updated</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{reservation.userName}</td>
                  <td className="p-2">{reservation.lockerNumber}</td>
                  <td className="p-2 capitalize">{reservation.lockerSize}</td>
                  <td className="p-2">{reservation.startDate.toDate().toLocaleDateString()}</td>
                  <td className="p-2">{reservation.endDate.toDate().toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(reservation.status)}
                      <span className="capitalize">{reservation.status}</span>
                    </div>
                  </td>
                  <td className="p-2">${reservation.totalPrice}</td>
                  <td className="p-2">{reservation.createdAt.toDate().toLocaleDateString()}</td>
                  <td className="p-2">{reservation.updatedAt.toDate().toLocaleDateString()}</td>
                  <td className="p-2">
                    <select
                      className="border rounded p-1"
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReservationsDashboard;