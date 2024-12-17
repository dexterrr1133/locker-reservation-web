'use client';

import { FC, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';
import { LockerConfig, LockerProps, LockerGrid } from '@/app/constants/lockers';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SmallLockers: FC<LockerProps> = ({ className = '' }) => {
  const config: LockerConfig = {
    rows: 8,
    cols: 12,
    size: 'w-20 h-20'
  };

  interface LockerOwner {
    name: string;
    email: string;
    startDate: string;
    endDate: string;
    size: string;
  }
  
  interface LockerData {
    id: string;
    color: string;
    owner?: LockerOwner | null;
    size: string;
  }
  
  interface FirestoreLockerData {
    owner?: LockerOwner;
  }

  const [lockers, setLockers] = useState<LockerData[][]>([]);
  const [selectedLocker, setSelectedLocker] = useState<LockerData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [userHasReservedLocker, setUserHasReservedLocker] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
      // Listen for auth state changes (e.g., user login)
      const unsubscribe = onAuthStateChanged(auth, (users) => {
        if (users && users.email) {
          setUserEmail(users.email || ''); // Ensure email is available
        } else {
          // Handle user not authenticated
          setUserEmail('');
        }
        setLoading(false);

      // Cleanup the listener on unmount
      return () => unsubscribe();
    },);


    const fetchLockerData = async () => {
      const initialLockers = Array(config.rows).fill(null).map((_, rowIndex) =>
        Array(config.cols).fill(null).map((_, colIndex) => ({
          color: '#ffffff',
          id: `Small-${rowIndex}-${colIndex}`,
          size: 'Small'
        }))
      );

      try {
        const lockersCollection = collection(db, 'reservations');
        const lockersSnapshot = await getDocs(lockersCollection);

        lockersSnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreLockerData;
          const [_, row, col] = doc.id.split('-').map(Number);
          if (initialLockers[row] && initialLockers[row][col]) {
            const updatedLocker: LockerData = {
              ...initialLockers[row][col],
              owner: data.owner || null
            };
            initialLockers[row][col] = updatedLocker;
          }
        });
      } catch (error) {
        console.error('Error fetching locker data:', error);
      }
      setLockers(initialLockers);
    };

    fetchLockerData();
  }, []);

  // Check if the user has already reserved a locker
  useEffect(() => {
    const checkUserReservation = async (email: string) => {
      try {
        const q = query(collection(db, 'reservations'), where('owner.email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserHasReservedLocker(true); // User has already reserved a locker
        }
      } catch (error) {
        console.error('Error checking user reservation:', error);
      }
    };

    checkUserReservation(userEmail);
  }, [userEmail]);

  const handleLockerClick = async (rowIndex: number, colIndex: number) => {
    const locker = lockers[rowIndex][colIndex];
    setSelectedLocker(locker);
    setIsDetailsOpen(true);
  };

  const assignLocker = async (rowIndex: number, colIndex: number, ownerData: LockerOwner) => {
    const lockerId = `Small-${rowIndex}-${colIndex}`;

    try {
      const lockerRef = doc(db, 'reservations', lockerId);
      await setDoc(lockerRef, {
        owner: ownerData
      }, { merge: true });

      setLockers(prev => {
        const newLockers = prev.map(row => [...row]);
        newLockers[rowIndex][colIndex] = {
          ...newLockers[rowIndex][colIndex],
          owner: ownerData
        };
        return newLockers;
      });

      setSelectedLocker(prev => prev ? { ...prev, owner: ownerData } : null);

      return true;
    } catch (error) {
      console.error('Error assigning locker:', error);
      return false;
    }
  };

  const handleReserveSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedLocker) return;

    const formData = new FormData(event.currentTarget);
    const ownerData: LockerOwner = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      size: "Small" as string
    };

    const [row, col] = selectedLocker.id.split('-').slice(1).map(Number);

    const success = await assignLocker(row, col, ownerData);
    if (success) {
      setIsReserveOpen(false);
    } else {
      console.error('Failed to reserve locker');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Small Lockers</h2>
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
                    <Lock className={locker.owner ? "text-green-600" : "text-gray-400"} />
                    <span className="mt-2 text-sm">
                      {`${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`}
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

          {selectedLocker.owner ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="font-medium">{selectedLocker.owner.name}</span>
              </div>
              <p>Email: {selectedLocker.owner.email}</p>
              <p>Start Date: {selectedLocker.owner.startDate}</p>
              <p>End Date: {selectedLocker.owner.endDate}</p>
            </div>
          ) : (
            <div className="italic">
              This locker is currently unassigned
            </div>
          )}

          {selectedLocker.owner && selectedLocker.owner.email === userEmail ? (
            <div className="mt-4 text-green-600">This is your current locker for the semester.</div>
          ) : (
            !selectedLocker.owner && !userHasReservedLocker && (
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => setIsReserveOpen(true)}
              >
                Reserve Locker
              </button>
            )
          )}

          {userHasReservedLocker && !selectedLocker.owner && (
            <div className="mt-4 text-red-500">
              You already have a reserved locker.
            </div>
          )}
        </Card>
      )}

      {isReserveOpen && (
        <Card className="p-6">
          <form onSubmit={handleReserveSubmit}>
            <h3 className="text-xl font-semibold mb-4">Reserve Locker</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input name="name" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" type="email" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Start Date</label>
                <input name="startDate" type="date" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input name="endDate" type="date" className="w-full p-2 border rounded" required />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setIsReserveOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Reserve
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default SmallLockers;