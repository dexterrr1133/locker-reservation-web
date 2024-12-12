'use client';

import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { LockerConfig, LockerProps, LockerGrid } from '@/app/constants/lockers';

const TallLockers: FC<LockerProps> = ({ className = '' }) => {
  const config: LockerConfig = {
    rows: 3,
    cols: 10,
    size: 'w-20 h-60'
  };

  const colors = [
    '#ffffff', // white
    '#bfdbfe', // blue-200
    '#bbf7d0', // green-200
    '#fde68a', // yellow-200
    '#ddd6fe'  // purple-200
  ];

  const [lockers, setLockers] = useState<LockerGrid>(() => 
    Array(config.rows).fill(null).map((_, rowIndex) => 
      Array(config.cols).fill(null).map((_, colIndex) => ({
        color: '#ffffff',
        id: `tall-${rowIndex}-${colIndex}`
      }))
    )
  );

  const handleClick = (rowIndex: number, colIndex: number): void => {
    setLockers(prev => {
      const newLockers = prev.map(row => [...row]);
      const currentColorIndex = colors.indexOf(newLockers[rowIndex][colIndex].color);
      const nextColorIndex = (currentColorIndex + 1) % colors.length;
      newLockers[rowIndex][colIndex] = {
        ...newLockers[rowIndex][colIndex],
        color: colors[nextColorIndex]
      };
      return newLockers;
    });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Tall Lockers</h3>
        
        <div className="grid gap-4">
          {lockers.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 justify-center">
              {row.map((locker, colIndex) => (
                <button
                  key={locker.id}
                  className={`${config.size} rounded-lg border-2 border-gray-300 
                            transition-colors duration-200 hover:opacity-90 relative
                            flex items-center justify-center`}
                  style={{ backgroundColor: locker.color }}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  aria-label={`Tall locker ${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`}
                >
                  <Lock className="text-gray-400" size={24} />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {`${colIndex + 1}${String.fromCharCode(65 + rowIndex)}`}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Dimensions: 20 × 60 units
        </div>
      </div>
    </Card>
  );
};

export default TallLockers;