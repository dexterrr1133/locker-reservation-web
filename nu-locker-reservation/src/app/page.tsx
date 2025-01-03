"use client";
import React, { useEffect} from "react";
import { usePathname, useRouter } from "next/navigation";

const Home = () => {
    const pathname = usePathname();
    const navigate = useRouter();
  
    useEffect(() => {
      if (pathname === "/") {
        navigate.push("/home");
      }
    }, [pathname, navigate]);
  
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  };
  
  export default Home;