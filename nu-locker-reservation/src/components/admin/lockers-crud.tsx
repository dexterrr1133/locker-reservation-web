'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SmallLockersCrud: FC = () => {
  const config = {
    rows: 8,
    cols: 12,
    size: 'w-20 h-20'
  };

  type LockerStatus = 'available' | 'damaged' | 'maintenance';

  interface LockerData {
    id: string;
    color: string;
    status: LockerStatus;
    price: number;
    lastUpdated: string;
  }

  interface FirestoreLockerData {
    status: LockerStatus;
    price: number;
    lastUpdated: string;
  }

  const [lockers, setLockers] = useState<LockerData[][]>([]);
  const [selectedLocker, setSelectedLocker] = useState<LockerData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const getStatusColor = (status: LockerStatus) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'damaged':
        return 'text-red-600';
      case 'maintenance':
        return 'text-yellow-600';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: LockerStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle className={getStatusColor(status)} />;
      case 'damaged':
        return <AlertTriangle className={getStatusColor(status)} />;
      case 'maintenance':
        return <Lock className={getStatusColor(status)} />;
      default:
        return <Lock className={getStatusColor(status)} />;
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (users) => {
      if (users && users.email) {
        setUserEmail(users.email || '');
      } else {
        setUserEmail('');
      }
      setLoading(false);
    });

    const fetchLockerData = async () => {
      const initialLockers = Array(config.rows).fill(null).map((_, rowIndex) =>
        Array(config.cols).fill(null).map((_, colIndex) => ({
          color: '#ffffff',
          id: `Small-${rowIndex}-${colIndex}`,
          status: 'available' as LockerStatus,
          price: 25.00, // Lower default price for small lockers
          lastUpdated: new Date().toISOString()
        }))
      );

      try {
        const lockersCollection = collection(db, 'small-lockers');
        const lockersSnapshot = await getDocs(lockersCollection);

        lockersSnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreLockerData;
          const [_, row, col] = doc.id.split('-').map(Number);
          if (initialLockers[row] && initialLockers[row][col]) {
            initialLockers[row][col] = {
              ...initialLockers[row][col],
              status: data.status || 'available',
              price: data.price || 25.00,
              lastUpdated: data.lastUpdated || new Date().toISOString()
            };
          }
        });
      } catch (error) {
        console.error('Error fetching locker data:', error);
      }
      setLockers(initialLockers);
    };

    fetchLockerData();
    return () => unsubscribe();
  }, []);

  const handleLockerClick = (rowIndex: number, colIndex: number) => {
    const locker = lockers[rowIndex][colIndex];
    setSelectedLocker(locker);
    setIsDetailsOpen(true);
  };

  const updateLocker = async (rowIndex: number, colIndex: number, updateData: Partial<FirestoreLockerData>) => {
    const lockerId = `Small-${rowIndex}-${colIndex}`;

    try {
      const lockerRef = doc(db, 'small-lockers', lockerId);
      const updatedData = {
        ...updateData,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(lockerRef, updatedData, { merge: true });

      setLockers(prev => {
        const newLockers = prev.map(row => [...row]);
        newLockers[rowIndex][colIndex] = {
          ...newLockers[rowIndex][colIndex],
          ...updatedData
        };
        return newLockers;
      });

      setSelectedLocker(prev => prev ? { ...prev, ...updatedData } : null);
      return true;
    } catch (error) {
      console.error('Error updating locker:', error);
      return false;
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedLocker) return;

    const formData = new FormData(event.currentTarget);
    const updateData: Partial<FirestoreLockerData> = {
      status: formData.get('status') as LockerStatus,
      price: parseFloat(formData.get('price') as string),
    };

    const [row, col] = selectedLocker.id.split('-').slice(1).map(Number);
    const success = await updateLocker(row, col, updateData);
    
    if (success) {
      setIsEditOpen(false);
    } else {
      console.error('Failed to update locker');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Small Lockers Management</h2>
        <div className="grid gap-2 justify-center">
          {lockers.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((locker, colIndex) => (
                <div
                  key={locker.id}
                  className={`${config.size} relative cursor-pointer border rounded-lg transition-all hover:shadow-lg`}
                  style={{ backgroundColor: locker.color }}
                  onClick={() => handleLockerClick(rowIndex, colIndex)}
                >
                  <Card className="absolute inset-0 flex flex-col items-center justify-center">
                    {getStatusIcon(locker.status)}
                    <span className="mt-1 text-xs">
                      {`${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`}
                    </span>
                    <span className="text-xs font-medium">
                      ${locker.price}
                    </span>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {isDetailsOpen && selectedLocker && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Locker Details: {selectedLocker.id}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsDetailsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedLocker.status)}
              <span className="font-medium capitalize">{selectedLocker.status}</span>
            </div>
            <p>Price: ${selectedLocker.price.toFixed(2)}</p>
            <p>Last Updated: {new Date(selectedLocker.lastUpdated).toLocaleDateString()}</p>
          </div>

          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Locker
          </button>
        </Card>
      )}

      {isEditOpen && (
        <Card className="p-6">
          <form onSubmit={handleEditSubmit}>
            <h3 className="text-xl font-semibold mb-4">Edit Locker Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select 
                  name="status" 
                  className="w-full p-2 border rounded"
                  defaultValue={selectedLocker?.status}
                  required
                >
                  <option value="available">Available</option>
                  <option value="damaged">Damaged</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Price ($)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  defaultValue={selectedLocker?.price}
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default SmallLockersCrud;