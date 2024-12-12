'use client'

import React, { useState, useEffect } from 'react';
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { ModeToggle } from "@/components/toggle-light-dark-mode";

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
      price: "$500 per AY",
      route: "/small_lockers",
      description: "Ideal for compact storage needs",
      imagePlaceholder: "/small-locker.jpg"
    },
    {
      title: "Medium Locker",
      size: "21.5\" x 11\"",
      price: "$800 per AY",
      route: "/medium_lockers",
      description: "Perfect for standard storage requirements",
      imagePlaceholder: "/medium-locker.jpg"
    },
    {
      title: "Tall Locker",
      size: "32\" x 11\"",
      price: "$1200 per AY",
      route: "/tall_lockers",
      description: "Spacious solution for extensive storage",
      imagePlaceholder: "/tall-locker.jpg"
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
    <div className="min-h-screen p-12 relative">
      <Header />
      
      {/* User Info Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-6">
          {/* Display user info if logged in, otherwise prompt to log in */}
          {user ? (
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {user.email}</h2>
          ) : (
            <div className="text-xl text-gray-600">
              <p>Please <a href="/login" className="text-blue-500">log in</a> to access more features.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-bold text-gray-800">Secure Your Storage Needs with Locker</h1>
        </div>
        
        <p className="text-gray-600 text-xl mb-10">Find the perfect storage solution tailored to your needs</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {lockerTypes.map((locker, index) => (
            <Card 
              key={index}
              className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => router.push(locker.route)}
            >
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {locker.title}
                </CardTitle>
                <CardDescription className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">{locker.size}</span>
                  <span className="font-bold text-green-600">{locker.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                  <Image 
                    src={locker.imagePlaceholder} 
                    alt={`${locker.title} visualization`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}