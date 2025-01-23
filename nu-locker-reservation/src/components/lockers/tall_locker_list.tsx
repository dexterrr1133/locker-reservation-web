'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { 
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where
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

interface UserDocument {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}


const TallLockers: FC = () => {
  const config = {
    rows: 3,
    cols: 10,
    size: 'w-20 h-60' // Adjusted size for tall lockers
  };

  const [lockers, setLockers] = useState<LockerData[][]>([]);
  const [selectedLocker, setSelectedLocker] = useState<LockerData | null>(null);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userHasLocker, setUserHasLocker] = useState<boolean>(false);
  const [userLocker, setUserLocker] = useState<LockerData | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [refreshLockers, setRefreshLockers] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserDocument | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email || '');
        checkUserLockerStatus(user.email);
        fetchUserData(user.email);
      } else {
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email: string) => {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data() as UserDocument;
          setUserData(userDoc);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

  const checkUserLockerStatus = async (email: string) => {
    try {
      const q = query(collection(db, 'reservations'), where('email', '==', email), where('status', 'in', ['Pending', 'Reserved', 'Available']));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUserHasLocker(true);
        setUserLocker(querySnapshot.docs[0].data() as LockerData);
      } else {
        setUserHasLocker(false);
        setUserLocker(null);
      }
    } catch (error) {
      console.error('Error checking user locker status:', error);
    }
  };

  useEffect(() => {
    const fetchLockerData = async () => {
      const initialLockers = Array(config.rows).fill(null).map((_, rowIndex) =>
        Array(config.cols).fill(null).map((_, colIndex) => ({
          color: '#ffffff',
          id: `Tall-${rowIndex}-${colIndex}`,
          lockerNumber: `${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`,
          lockerSize: 'Tall',
          status: 'Available',
        }))
      );

      try {
        const lockersCollection = collection(db, 'reservations');
        const q = query(lockersCollection, where('lockerSize', '==', 'Tall'));
        const lockersSnapshot = await getDocs(q);

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
  }, [config.cols, config.rows, refreshLockers]);

  const handleLockerClick = (rowIndex: number, colIndex: number) => {
    const locker = lockers[rowIndex][colIndex];
    setSelectedLocker(locker);
    if (userHasLocker) {
      setIsReserveOpen(false);
    } else {
      setIsReserveOpen(locker.status === 'Available');
    }
  };

  const assignLocker = async (rowIndex: number, colIndex: number, lockerData: Partial<LockerData>) => {
    const lockerId = `Large-${rowIndex}-${colIndex}`;

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
      setRefreshLockers(prev => !prev); // Trigger re-fetch of lockers

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
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
      setIsErrorDialogOpen(true);
      return;
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const userName = `${firstName} ${lastName}`;

    const lockerData: Partial<LockerData> = {
      userName,
      lockerNumber: selectedLocker.lockerNumber,
      lockerSize: selectedLocker.lockerSize,
      status: 'Pending',
      email: userEmail,
      startDate,
      endDate,
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
          <h2 className="text-2xl font-bold mb-4 p-6">Tall Lockers</h2>
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
                        : locker.status === 'Completed'
                        ? '#ff6961' // Red for Completed
                        : '#ffffff', // White for Available
                    }}
                    onClick={() => handleLockerClick(rowIndex, colIndex)}
                  >
                    <Card className="absolute inset-0 flex flex-col items-center justify-center">
                      <Lock
                        className={
                          locker.status === 'Reserved'
                            ? 'text-red-600'
                            : locker.status === 'Pending'
                            ? 'text-yellow-500'
                            : locker.status === 'Completed'
                            ? 'text-red-600'
                            : 'text-green-400'
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

      {isReserveOpen && !userHasLocker && (
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
                  <Label htmlFor="firstName" className="text-right">
                    First Name
                  </Label>
                  <Input id="firstName" name="firstName" placeholder="Enter your first name" className="col-span-3" defaultValue={userData?.firstName || ''} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Last Name
                  </Label>
                  <Input id="lastName" name="lastName" placeholder="Enter your last name" className="col-span-3" defaultValue={userData?.lastName || ''} required />
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

      {userHasLocker && userLocker && (
        <Dialog open={!isReserveOpen} onOpenChange={() => setIsReserveOpen(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Your Reserved Locker</DialogTitle>
              <DialogDescription>
                Here are the details of your reserved locker.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Locker Number</Label>
                <div className="col-span-3">{userLocker.lockerNumber}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Locker Size</Label>
                <div className="col-span-3">{userLocker.lockerSize}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">{userLocker.status}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <div className="col-span-3">{userLocker.startDate}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End Date</Label>
                <div className="col-span-3">{userLocker.endDate}</div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsReserveOpen(true)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isErrorDialogOpen && (
        <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>
                The end date must be after the start date.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsErrorDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TallLockers;