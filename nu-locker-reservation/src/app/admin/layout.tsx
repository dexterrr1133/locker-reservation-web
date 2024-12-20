"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/features/app-sidebar";
import Nav from "@/components/features/admin_navbar";
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";


  
  const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
  
    return (
        <SidebarProvider >
        <AppSidebar />
        <SidebarInset>
          <Nav />
          {/* page main content */}
          {children}
          <Toaster />
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    );
  };
  
  export default AdminLayout;