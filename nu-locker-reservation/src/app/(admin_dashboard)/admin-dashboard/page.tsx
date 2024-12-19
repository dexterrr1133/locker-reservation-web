'use client';

import { useEffect } from 'react';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin-dashboard/overview');
      } else {
        router.push('/admin-dashboard/overview');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Optional loading state while checking auth
  return <div>Loading...</div>;
}