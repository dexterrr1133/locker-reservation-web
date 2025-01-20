'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LockerReservation() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          router.push("/login"); // Redirect to login if no user is found
        }
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  
      
  
    const lockerTypes = [
      {
        title: "Small Locker",
        size: "16\" x 11\"",
        price: "₱500 per AY",
        route: "/small_lockers",
        description: "Ideal for compact storage needs",
        imagePlaceholder: "/img/locker_small.png"
      },
      {
        title: "Medium Locker",
        size: "21.5\" x 11\"",
        price: "₱800 per AY",
        route: "/medium_lockers",
        description: "Perfect for standard storage requirements",
        imagePlaceholder: "/img/locker_small.png"
      },
      {
        title: "Tall Locker",
        size: "32\" x 11\"",
        price: "₱1200 per AY",
        route: "/tall_lockers",
        description: "Spacious solution for extensive storage",
        imagePlaceholder: "/img/locker_small.png"
      }
    ];
  
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      );
    }

  return (
    <div className="min-h-full flex justify-start">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="bg-white min-h-full p-6 m-6 rounded shadow-md">
          {/* Title */}
          <div className="flex items-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold text-gray-800 flex-grow">Reserve a locker</h1>
            <span className="text-gray-600">Step 1 of 3: Choose locker size</span>
          </div>

          <div className="flex justify-between h-3/4">
            {/* Sidebar */}
            <div className="w-96 pr-4">
              <ul className="text-blue-500 border-l-4 border-blue-500 py-2 px-4">
                <li className="mb-2">Choose locker size</li>
                <li className="text-gray-500 mb-2">Choose locker location</li>
                <li className="text-gray-500">Payment</li>
              </ul>
            </div>

            {/* Locker Options */}
            <div className="w-full grid md:grid-cols-3 gap-8">
            {lockerTypes.map((locker, index) => (
              <Card 
                key={index}
                className="max-w-sm rounded-lg shadow-md p-6 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
                onClick={() => router.push(locker.route)}
              >
                <CardHeader className="p-6 pb-0">
                  <CardTitle className="text-xl font-semibold">
                    {locker.title}
                  </CardTitle>
                  <CardDescription className="flex justify-between items-center mt-2">
                    <span className="">{locker.size}</span>
                    <span className="font-bold text-green-600">{locker.price}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  <div className=" relative w-full max-h-[1920] overflow-hidden rounded-lg">
                    <Image 
                      src={locker.imagePlaceholder} 
                      alt={`${locker.title} visualization`}
                      width={1080}
                      height={1920}
                      
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-auto object-contain" // or "object-cover" depending on your preference
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
