'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/features/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { ModeToggle } from "@/components/features/toggle-light-dark-mode";
import Spline from '@splinetool/react-spline';

export default function HomeDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Track user authentication state
      setLoading(false);
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
      imagePlaceholder: "/img/locker_medium.png"
    },
    {
      title: "Tall Locker",
      size: "32\" x 11\"",
      price: "₱1200 per AY",
      route: "/tall_lockers",
      description: "Spacious solution for extensive storage",
      imagePlaceholder: "/img/locker_large.png"
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
    <div className="min-h-screen relative">
      <Header />
      
      {/* User Info Section */}
      <div className="max-w-6xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          {/* Display user info if logged in, otherwise prompt to log in */}
          {user ? (
            <h2 className="text-xl font-semibold pt-10">Welcome, {user.email}</h2>
          ) : (
            <div className="text-xl pt-10">
              <p>Please <a href="/login" className="text-blue-500 hover:underline">log in</a> to access more features.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold">Secure Your Storage Needs with Locker</h1>
          <div className="hidden sm:block">
      
          </div>
        </div>
        
        <p className="text-xl mb-10">Find the perfect storage solution tailored to your needs</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {lockerTypes.map((locker, index) => (
            <Card 
              key={index}
              className="max-w-sm rounded-lg shadow-md p-6 transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 cursor-pointer"
              onClick={() => router.push(locker.route)}
            >
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl font-semibold">
                  {locker.title}
                </CardTitle>
                <CardDescription className="flex justify-between items-center mt-2">
                  <span>{locker.size}</span>
                  <span className="font-bold text-green-600">{locker.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <div className="relative w-full aspect-[9/16] overflow-hidden rounded-lg">
                  <Image
                    src={locker.imagePlaceholder}
                    alt={`${locker.title} visualization`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Spline Animation */}
      <div className="mt-12">
        <Spline scene="https://prod.spline.design/VmMUbymeSixicqGl/scene.splinecode" />
      </div>
    </div>
  );
}