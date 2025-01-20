"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const AdminDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {

    if (pathname === "/admin") {
      router.push("/admin/overview");
    }
  }, [pathname, router]);

  return (
    <div className="flex-1 w-full flex items-center justify-center min-h-screen">
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;