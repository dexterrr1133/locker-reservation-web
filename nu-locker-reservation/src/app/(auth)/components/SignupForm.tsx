"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";




export function SignupForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
   

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
  
    
        // Validate passwords match
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
    
        try {
          setLoading(true);
          // Create user with Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          console.log("User created: ", user.uid);
          console.log("User email: ", user.email);

    
          // Save user data to Firestore
          await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email: user.email,
            createdAt: new Date(),
          });

          console.log("User data stored in Firestore.");
          router.push(`/home`);
    
          setLoading(false);  // End loading state
      // Handle successful signup (optional, redirect or show success message)
         } catch (err: any) {
            setLoading(false);  // End loading state
            setError(err.message || "An error occurred during signup.");
            console.error("Error during signup: ", err.message);
        }
      };

 
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Signup</CardTitle>
        <CardDescription>
          Enter your email below to signup to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSignup} className="grid gap-4">
      <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
                id="firstName"
                type="text"
                placeholder="Hi"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
             />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">Last Name</Label>
            <Input
                id="lastName"
                type="text"
                placeholder="Seulgi"
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
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
             />
        </div>

        <div className="grid gap-2">
            <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                </Link>
            </div>
            <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

         <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Signup"}
        </Button>

        <div className="mt-4 text-center text-sm">
            Have an account?{" "}
            <Link href="/login" className="underline">
                Sign in
            </Link>
        </div>
        </form>
        
      </CardContent>
    </Card>
  );
}