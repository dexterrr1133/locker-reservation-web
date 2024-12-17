"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Chart } from "@/components/features/chart"
import { AppSidebar } from "@/components/features/app-sidebar"
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
  } from "@/components/ui/card"
import { ModeToggle } from "@/components/features/toggle-light-dark-mode"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { db } from "@/services/firebase"

  type LockerStats = {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
  };

export default function Page() {
    // Sample data structures (would typically come from backend)
    const [lockerStats, setLockerStats] = useState<LockerStats>({
      total: 0,
      available: 0,
      inUse: 0,
      maintenance: 0,
    });
    useEffect(() => {
      const fetchLockers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "locker"));
          let total = 0,
            available = 0,
            inUse = 0,
            maintenance = 0;
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total++;
            if (data.status === "available") available++;
            if (data.status === "in-use") inUse++;
            if (data.status === "maintenance") maintenance++;
          });
  
          setLockerStats({ total, available, inUse, maintenance });
        } catch (error) {
          console.error("Error fetching lockers:", error);
        }
      };
  
      fetchLockers();
    }, []);
  
    const recentReservations = [
      { id: 1, user: 'John Doe', locker: 'A-12', startDate: '2024-03-15', endDate: '2024-03-22' },
      { id: 2, user: 'Jane Smith', locker: 'B-05', startDate: '2024-03-16', endDate: '2024-03-25' }
    ]
  
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header with Sidebar Trigger and Breadcrumbs */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Locker Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
  
          {/* Main Content Area */}
          <div className="p-6 space-y-6">
            {/* Locker Usage Chart */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Locker Usage</h1>
              <LockerChart />
            </div>
  
            {/* Statistics and Recent Reservations */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Locker Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Total Lockers: {lockerStats.total}</p>
                    <p>Available Lockers: {lockerStats.available}</p>
                    <p>Lockers in Use: {lockerStats.inUse}</p>
                    <p>Lockers in Maintenance: {lockerStats.maintenance}</p>
                  </div>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Locker</TableHead>
                        <TableHead>Dates</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>{reservation.user}</TableCell>
                          <TableCell>{reservation.locker}</TableCell>
                          <TableCell>{`${reservation.startDate} to ${reservation.endDate}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
  
            {/* Locker Management */}
            <Card>
              <CardHeader>
                <CardTitle>Locker Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input placeholder="Search lockers" />
                  <Button>Add New Locker</Button>
                </div>
                {/* Locker list would go here */}
              </CardContent>
            </Card>
          </div>
  
          {/* Mode Toggle */}
          <div className="absolute right-6 bottom-5">
            <ModeToggle />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  };
  
  // Placeholder chart component (you'd replace with actual chart implementation)
  function LockerChart() {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Locker Usage Chart Placeholder
          </div>
        </CardContent>
      </Card>
    )
  }

