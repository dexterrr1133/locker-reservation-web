'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function LockerReservation() {
  return (
    <div className="min-h-screen flex justify-start ">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="bg-white min-h-screen p-6 m-6 rounded shadow-md">
          {/* Title */}
          <div className="flex items-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold text-gray-800 flex-grow">Reserve a locker</h1>
            <span className="text-gray-600">Step 1 of 3: Choose locker size</span>
          </div>

          <div className="flex justify-between">
            {/* Sidebar */}
            <div className="w-1/6 pr-4">
              <ul className="text-blue-500 border-l-4 border-blue-500 py-2 px-4">
                <li className="mb-2">Choose locker size</li>
                <li className="text-gray-500 mb-2">Choose locker location</li>
                <li className="text-gray-500">Payment</li>
              </ul>
            </div>

            {/* Locker Options */}
            <div className="flex-grow grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="https://placehold.co/320x180"
                  alt="Placeholder for small locker image"
                  width={150}
                  height={150}
                  className="mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">Small Locker</h2>
                <p className="text-gray-600 mb-2">18&quot; x 11&quot;</p>
                <p className="text-gray-600">$50 per yr</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="https://placehold.co/320x180"
                  alt="Placeholder for medium locker image"
                  width={150}
                  height={150}
                  className="mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">Medium Locker</h2>
                <p className="text-gray-600 mb-2">35&quot; x 11&quot;</p>
                <p className="text-gray-600">$80 per yr</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="https://placehold.co/320x180"
                  alt="Placeholder for large locker image"
                  width={150}
                  height={150}
                  className="mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">Large Locker</h2>
                <p className="text-gray-600 mb-2">53&quot; x 11&quot;</p>
                <p className="text-gray-600">$120 per yr</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
