"use client";
import React, { useEffect} from "react";
import { usePathname, useRouter } from "next/navigation";

const AdminDashboard = () => {
    const pathname = usePathname();
    const navigate = useRouter();
  
    useEffect(() => {
      if (pathname === "/admin") {
        navigate.push("/admin/overview");
      }
    }, [pathname, navigate]);
  
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div>Loading..</div>
      </div>
    );
  };
  
  export default AdminDashboard;