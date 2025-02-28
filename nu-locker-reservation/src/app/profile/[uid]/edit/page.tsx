// app/profile/[uid]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const resolvedParams = React.use(params);
  const uid = resolvedParams.uid;
  const { user, loading } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.uid !== uid)) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, loading, uid]);

  const fetchUserData = async () => {
    try {
      const userDocs = await getDoc(doc(db, "users", uid));
      if (userDocs.exists()) {
        const userData = userDocs.data();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!firstName || !lastName) {
        throw new Error("First name and last name are required!");
      }

      await updateDoc(doc(db, "users", uid), {
        firstName,
        lastName,
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        router.push(`/home`);
      }, 2000);
    } catch (err: any) {
      console.error("Update Error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.uid !== uid) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500">Email cannot be changed</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/home`)}
              className="w-full"
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}