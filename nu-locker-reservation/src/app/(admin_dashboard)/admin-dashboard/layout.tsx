
import { cookies } from 'next/headers';
import { AppSidebar } from "@/components/features/app-sidebar";
import Nav from "@/components/features/admin_navbar";
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';


export default function AdminLayout({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {

    const cookieStore = cookies();
    // const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';



    return (
      <SidebarProvider >
        <AppSidebar />
        <SidebarInset>
          <Nav />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    );
  }