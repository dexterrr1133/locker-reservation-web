"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { doc, documentId, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Header from "@/components/features/header";

export default function UserPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract the document ID from the route params
  const params = useParams();
  const userId = params?.userId as string | undefined;

  useEffect(() => {
    if (!userId) {
      setError("Document ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Use the documentId directly to fetch the document
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  // Error handling
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Main render
  return (
    <div className="min-h-screen p-12 relative">
      <Header />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-bold text-gray-800">Welcome to your Locker Dashboard!</h1>
        </div>
        <p className="text-gray-600 text-xl mb-10">Your personalized locker management system</p>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">User Information</h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Your Profile</CardTitle>
              <CardDescription>
                Here is the information we have on you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">Email: {userData?.email}</p>
              <p className="text-lg text-gray-700">Document ID: {documentId}</p>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the component remains the same */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Small Locker",
              size: "16\" x 11\"",
              price: "$500 per AY",
              route: "/small_lockers",
              description: "Ideal for compact storage needs",
              imagePlaceholder: "/small-locker.jpg",
            },
            {
              title: "Medium Locker",
              size: "21.5\" x 11\"",
              price: "$800 per AY",
              route: "/medium_lockers",
              description: "Perfect for standard storage requirements",
              imagePlaceholder: "/medium-locker.jpg",
            },
            {
              title: "Tall Locker",
              size: "32\" x 11\"",
              price: "$1200 per AY",
              route: "/tall_lockers",
              description: "Spacious solution for extensive storage",
              imagePlaceholder: "/tall-locker.jpg",
            },
          ].map((locker, index) => (
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