'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface LockerData {
  id: string;
  size: 'small' | 'medium' | 'tall';
  status: 'available' | 'occupied' | 'maintenance' | 'damaged';
  price: number;
  owner: string | null;
  reservedAt: string | null;
  reservedUntil: string | null;
  location: string;
}

type SizeFilter = 'all' | 'small' | 'medium' | 'tall';
type StatusFilter = 'all' | 'available' | 'occupied' | 'maintenance' | 'damaged';

const LockerDashboard: FC = () => {
  const [lockers, setLockers] = useState<LockerData[]>([]);
  const [filteredLockers, setFilteredLockers] = useState<LockerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
    damaged: 0,
  });

  useEffect(() => {
    fetchLockers();
  }, []);

  useEffect(() => {
    filterLockers();
  }, [lockers, sizeFilter, statusFilter]);

  const fetchLockers = async () => {
    try {
      setLoading(true);
      const lockersRef = collection(db, 'locker');
      const q = query(lockersRef, orderBy("size"));
      const querySnapshot = await getDocs(q);
      
      const fetchedLockers: LockerData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLockers.push({
          id: doc.id,
          ...doc.data() as Omit<LockerData, 'id'>
        });
      });

      setLockers(fetchedLockers);
      
      // Calculate statistics
      const newStats = fetchedLockers.reduce((acc, locker) => {
        acc.total++;
        acc[locker.status]++;
        return acc;
      }, {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        damaged: 0,
      });
      
      setStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching lockers');
    } finally {
      setLoading(false);
    }
  };

  const filterLockers = () => {
    let filtered = [...lockers];
    
    if (sizeFilter !== 'all') {
      filtered = filtered.filter(locker => locker.size === sizeFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(locker => locker.status === statusFilter);
    }
    
    setFilteredLockers(filtered);
  };

  const getStatusColor = (status: LockerData['status']) => {
    const colors = {
      available: 'text-green-600',
      occupied: 'text-gray-600',
      maintenance: 'text-yellow-600',
      damaged: 'text-red-600',
    };
    return colors[status];
  };

  const getStatusIcon = (status: LockerData['status']) => {
    const icons = {
      available: <CheckCircle className={getStatusColor(status)} />,
      occupied: <Lock className={getStatusColor(status)} />,
      maintenance: <AlertTriangle className={getStatusColor(status)} />,
      damaged: <AlertTriangle className={getStatusColor(status)} />,
    };
    return icons[status];
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Lockers</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-green-600">Available</h3>
          <p className="text-2xl font-bold">{stats.available}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-600">Occupied</h3>
          <p className="text-2xl font-bold">{stats.occupied}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-yellow-600">Maintenance</h3>
          <p className="text-2xl font-bold">{stats.maintenance}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-red-600">Damaged</h3>
          <p className="text-2xl font-bold">{stats.damaged}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4">
        {/* Size Filter */}
        <div className="flex gap-2">
          <span className="font-semibold my-auto w-20">Size:</span>
          <div className="flex gap-2">
            {(['all', 'small', 'medium', 'tall'] as const).map((size) => (
              <TabButton
                key={size}
                active={sizeFilter === size}
                onClick={() => setSizeFilter(size)}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </TabButton>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <span className="font-semibold my-auto w-20">Status:</span>
          <div className="flex gap-2">
            {(['all', 'available', 'occupied', 'maintenance', 'damaged'] as const).map((status) => (
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

      {/* Lockers Table */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Lockers Overview
          <span className="text-sm font-normal ml-2 text-gray-500">
            ({filteredLockers.length} lockers)
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Size</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Reserved Until</th>
              </tr>
            </thead>
            <tbody>
              {filteredLockers.map((locker) => (
                <tr key={locker.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{locker.id}</td>
                  <td className="p-2 capitalize">{locker.size}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(locker.status)}
                      <span className="capitalize">{locker.status}</span>
                    </div>
                  </td>
                  <td className="p-2">{locker.location}</td>
                  <td className="p-2">${locker.price}</td>
                  <td className="p-2">
                    {locker.reservedUntil ? new Date(locker.reservedUntil).toLocaleDateString() : '-'}
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

export default LockerDashboard;