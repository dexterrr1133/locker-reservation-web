'use client'

import * as React from "react";

import { SearchForm } from "@/components/features/search-form";
import { VersionSwitcher } from "@/components/features/version-switcher";
import { NavUser } from "@/components/ui/nav-user"
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
 
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Overview",
      url: "#",
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
         
        },
        {
          title: "List of Users",
          url: "/user-list",
          
        },
        {
          title: 'Lockers',
          url: '/admin/lockers',
          
        },
        {
          title: 'Reservations',
          url: '/admin/reserve_locker',
         
        },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();




  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((parentItem) => (
          <SidebarGroup key={parentItem.title}>
            <SidebarGroupLabel>{parentItem.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {parentItem.items.map((childItem) => (
                  <SidebarMenuItem key={childItem.title}>
                    <SidebarMenuButton asChild>
                      <a href={childItem.url}>{childItem.title}</a>
                      
                      
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
       
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}