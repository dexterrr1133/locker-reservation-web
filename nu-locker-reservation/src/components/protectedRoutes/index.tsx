"use client";

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const router = useRouter();
  const isAuth = true; // Replace with your actual authentication logic

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth, router]);

  return <>{children}</>;
};

export default ProtectedRoutes;