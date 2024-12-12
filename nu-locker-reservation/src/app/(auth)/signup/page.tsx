'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { SignupForm } from '@/components/signup-form';
import { ModeToggle } from '@/components/toggle-light-dark-mode';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect after successful signup
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
    };

    return(
        <div className="flex h-screen w-full items-center justify-center px-4">
            <SignupForm onSignup={handleSignup} loading={loading} error={error} />
            <div className="absolute right-6 bottom-5">
                <ModeToggle />
            </div>
        </div>
        
    )
}

export default Signup;