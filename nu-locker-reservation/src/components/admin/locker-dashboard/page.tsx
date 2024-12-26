'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

const LockersCrud: FC = () => {
  const [activeTab, setActiveTab] = useState<'Small' | 'Medium' | 'Tall'>('Small');
  const [lockers, setLockers] = useState<Record<string, any[][]>>({
    Small: [],
    Medium: [],
    Tall: [],
  });

  const configs: Record<'Small' | 'Medium' | 'Tall', { rows: number; cols: number; size: string; price: number }> = {
    Small: { rows: 8, cols: 12, size: 'w-20 h-20', price: 250 },
    Medium: { rows: 4, cols: 10, size: 'w-20 h-40', price: 300 },
    Tall: { rows: 3, cols: 10, size: 'w-20 h-60', price: 400 },
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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
    const fetchLockers = async () => {
      const fetchedLockers: Record<string, any[][]> = {
        Small: [],
        Medium: [],
        Tall: [],
      };

      for (const size of Object.keys(configs)) {
        const initialLockers = Array(configs[size].rows)
          .fill(null)
          .map((_, rowIndex) =>
            Array(configs[size].cols)
              .fill(null)
              .map((_, colIndex) => ({
                color: '#ffffff',
                id: `${size}-${rowIndex}-${colIndex}`,
                size: size.toLowerCase(),
                status: 'available',
                price: configs[size].price,
                owner: null,
                reservedAt: null,
                reservedUntil: null,
              }))
          );

        try {
          const lockersCollection = collection(db, 'locker');
          const snapshot = await getDocs(lockersCollection);

          snapshot.forEach((doc) => {
            const data = doc.data();
            const [size, row, col] = doc.id.split('-');
            const rowIndex = parseInt(row, 10);
            const colIndex = parseInt(col, 10);

            if (
              size &&
              rowIndex >= 0 &&
              colIndex >= 0 &&
              fetchedLockers[size]?.[rowIndex]?.[colIndex]
            ) {
              fetchedLockers[size][rowIndex][colIndex] = {
                ...fetchedLockers[size][rowIndex][colIndex],
                ...data,
              };
            }
          });

          fetchedLockers[size] = initialLockers;
        } catch (error) {
          console.error(`Error fetching ${size} lockers:`, error);
        }
      }

      setLockers(fetchedLockers);
    };

    fetchLockers();
  }, []);

  const handleTabChange = (tab: 'Small' | 'Medium' | 'Tall') => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        {(['Small', 'Medium', 'Tall'] as const).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab} Lockers
          </button>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{activeTab} Lockers Management</h2>
        <div className="grid gap-2 justify-center">
          {lockers[activeTab]?.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((locker, colIndex) => (
                <div
                  key={locker.id}
                  className={`${configs[activeTab].size} relative cursor-pointer border rounded-lg transition-all hover:shadow-lg`}
                  style={{ backgroundColor: locker.color }}
                  onClick={() => console.log('Clicked Locker:', locker)}
                >
                  <Card className="absolute inset-0 flex flex-col items-center justify-center">
                    {getStatusIcon(locker.status)}
                    <span className="mt-1 text-xs">
                      {`${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`}
                    </span>
                    <span className="text-xs font-medium">${locker.price}</span>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LockersCrud;
