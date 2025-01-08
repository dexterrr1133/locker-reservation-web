'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { 
  collection,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LockerData {
  id: string;
  color: string;
  lockerNumber: string;
  lockerSize: string;
  status: string;
  email?: string;
  startDate?: string;
  endDate?: string;
  userName?: string;
}

const MediumLockers: FC = () => {
  const config = {
    rows: 3,
    cols: 10,
    size: 'w-20 h-40'
  };

  const [lockers, setLockers] = useState<LockerData[][]>([]);
  const [selectedLocker, setSelectedLocker] = useState<LockerData | null>(null);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (users) => {
      if (users && users.email) {
        setUserEmail(users.email || '');
      } else {
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLockerData = async () => {
      const initialLockers = Array(config.rows).fill(null).map((_, rowIndex) =>
        Array(config.cols).fill(null).map((_, colIndex) => ({
          color: '#ffffff',
          id: `Medium-${rowIndex}-${colIndex}`,
          lockerNumber: `${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`,
          lockerSize: 'Medium',
          status: 'Available',
        }))
      );

      try {
        const lockersCollection = collection(db, 'reservations');
        const lockersSnapshot = await getDocs(lockersCollection);

        lockersSnapshot.forEach((doc) => {
          const data = doc.data() as LockerData;
          const [, row, col] = doc.id.split('-').map(Number);
          if (initialLockers[row] && initialLockers[row][col]) {
            initialLockers[row][col] = { ...initialLockers[row][col], ...data };
          }
        });
      } catch (error) {
        console.error('Error fetching locker data:', error);
      }
      setLockers(initialLockers);
    };

    fetchLockerData();
  }, [config.cols, config.rows]);

  const handleLockerClick = (rowIndex: number, colIndex: number) => {
    const locker = lockers[rowIndex][colIndex];
    setSelectedLocker(locker);
    if (locker.status !== 'Available') {
      setIsReserveOpen(false);
    } else {
      setIsReserveOpen(true);
    }
  };

  const assignLocker = async (rowIndex: number, colIndex: number, lockerData: Partial<LockerData>) => {
    const lockerId = `Medium-${rowIndex}-${colIndex}`;

    try {
      const lockerRef = doc(db, 'reservations', lockerId);
      await setDoc(lockerRef, lockerData, { merge: true });

      setLockers(prev => {
        const newLockers = prev.map(row => [...row]);
        newLockers[rowIndex][colIndex] = {
          ...newLockers[rowIndex][colIndex],
          ...lockerData
        };
        return newLockers;
      });

      setSelectedLocker(prev => prev ? { ...prev, ...lockerData } : null);

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
    const lockerData: Partial<LockerData> = {
      userName: formData.get('userName') as string,
      lockerNumber: selectedLocker.lockerNumber,
      lockerSize: selectedLocker.lockerSize,
      status: 'Pending',
      email: userEmail,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };

    const [row, col] = selectedLocker.id.split('-').slice(1).map(Number);

    const success = await assignLocker(row, col, lockerData);
    if (success) {
      setIsReserveOpen(false);
    } else {
      console.error('Failed to reserve locker');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 p-6">Medium Lockers</h2>
          <div className="grid gap-2 place-items-center">
            {lockers.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((locker, colIndex) => (
                  <div
                    key={locker.id}
                    className={`${config.size} relative cursor-pointer border rounded-lg transition-all hover:shadow-lg`}
                    style={{
                      backgroundColor: locker.status === 'Reserved'
                        ? '#a8d5a8' // Green for Reserved
                        : locker.status === 'Pending'
                        ? '#f9e79f' // Yellow for Pending
                        : '#ffffff', // White for Available
                    }}
                    onClick={() => handleLockerClick(rowIndex, colIndex)}
                  >
                    <Card className="absolute inset-0 flex flex-col items-center justify-center">
                      <Lock
                        className={
                          locker.status === 'Reserved'
                            ? 'text-green-600'
                            : locker.status === 'Pending'
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }
                      />
                      <span className="mt-2 text-sm">{locker.lockerNumber}</span>
                    </Card>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {isReserveOpen && (
        <Dialog open={isReserveOpen} onOpenChange={setIsReserveOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reserve a Locker</DialogTitle>
              <DialogDescription>
                Complete the form below. Click reserve when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleReserveSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userName" className="text-right">
                    Name
                  </Label>
                  <Input id="userName" name="userName" placeholder="Enter your name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input id="startDate" name="startDate" type="date" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input id="endDate" name="endDate" type="date" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsReserveOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Reserve
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MediumLockers;
