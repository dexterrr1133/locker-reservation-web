'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use the correct router for the App Router
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase'; // Make sure your Firebase setup is correct
import { LoginForm } from "@/components/login-form"
import { ModeToggle } from "@/components/toggle-light-dark-mode"


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); 
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
};


  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />
      <div className="absolute right-6 bottom-5">
                <ModeToggle />
            </div>
    </div>
  )
};

export default Login;