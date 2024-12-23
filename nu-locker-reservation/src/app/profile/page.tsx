'use client'
import {AppSidebar} from "@/components/features/profile-app-siderbar";
import Header from "@/components/features/header";
import ProfileCard from "@/components/features/profilecard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/services/firebase";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const AccountPage = () => {
  const [userId, setUserId] = useState<string | null>(null); // To store the logged-in user's ID

  // Fetch the current user's ID when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // If the user is logged in, set the userId
      } else {
        setUserId(null); // If no user is logged in, set it to null
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (!userId) {
    return <div>Please log in to view your account.</div>; // Display a message if the user is not logged in
  }

  return (
    <>
    <Header />
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator className="mr-2 h-4 vertical" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex h-full w-full bg-gray-200 border border-red-500">
        <div className="w-full p-8">
          <ProfileCard userId={userId} /> {/* Pass userId to ProfileCard */}
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
};

export default AccountPage;
