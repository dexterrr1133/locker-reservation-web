import { FC, useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Reservation {
  id: string;
  status: string;
  lockerNumber: string;
  lockerSize: string;
  userName: string;
  email: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  updatedAt?: Timestamp;
}

interface Stats {
  total: number;
  Pending: number;
  Reserved: number;
  Cancelled: number;
}

const ReservationsDashboard: FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, Pending: 0, Reserved: 0, Cancelled: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsCollection = collection(db, 'reservations');
        const reservationsSnapshot = await getDocs(reservationsCollection);
        const fetchedReservations = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Reservation[];

        setReservations(fetchedReservations);
        
        // Calculate statistics
        const newStats = fetchedReservations.reduce((acc, reservation) => {
          acc.total++;
          if (reservation.status === 'Pending') acc.Pending++;
          if (reservation.status === 'Reserved') acc.Reserved++;
          if (reservation.status === 'Cancelled') acc.Cancelled++;
          return acc;
        }, {
          total: 0,
          Pending: 0,
          Reserved: 0,
          Cancelled: 0,
        });

        setStats(newStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Pending: 'text-yellow-600',
      Reserved: 'text-green-600',
      Available: 'text-blue-600',
      Cancelled: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: JSX.Element } = {
      Pending: <Clock className={getStatusColor(status)} />,
      Reserved: <CheckCircle className={getStatusColor(status)} />,
      Available: <AlertCircle className={getStatusColor(status)} />,
      Cancelled: <XCircle className={getStatusColor(status)} />,
    };
    return icons[status] || <Clock className={getStatusColor(status)} />;
  };

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      const updatedStatus = newStatus === 'accept' ? 'Reserved' : 'Available';
      await updateDoc(reservationRef, {
        status: updatedStatus,
        updatedAt: Timestamp.now(),
      });
      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation.id === reservationId ? { ...reservation, status: updatedStatus } : reservation
        )
      );
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        Loading...
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Reservations</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-yellow-600">Pending</h3>
          <p className="text-2xl font-bold">{stats.Pending}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-green-600">Reserved</h3>
          <p className="text-2xl font-bold">{stats.Reserved}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-red-600">Cancelled</h3>
          <p className="text-2xl font-bold">{stats.Cancelled}</p>
        </Card>
      </div>

      {/* Reservations Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2">Locker Number</th>
                <th className="py-2">Locker Size</th>
                <th className="py-2">User Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Start Date</th>
                <th className="py-2">End Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id} className="border-b hover:bg-blue-500 text-center">
                  <td className="p-2">{reservation.lockerNumber}</td>
                  <td className="p-2 capitalize">{reservation.lockerSize}</td>
                  <td className="p-2">{reservation.userName}</td>
                  <td className="p-2">{reservation.email}</td>
                  <td className="p-2">{reservation.startDate.toString()}</td>
                  <td className="p-2">{reservation.endDate.toString()}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2 justify-center">
                      {getStatusIcon(reservation.status)}
                      <span className="capitalize">{reservation.status}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleStatusChange(reservation.id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleStatusChange(reservation.id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
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