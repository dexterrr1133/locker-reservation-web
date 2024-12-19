'use client'

import * as React from "react";

import { SearchForm } from "@/components/features/search-form";
import { VersionSwitcher } from "@/components/features/version-switcher";
import { NavUser } from "@/components/ui/nav-user"
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter, usePathname } from 'next/navigation';

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

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, LogOut, BadgeCheck, CreditCard, Bell, ChevronsUpDown } from 'lucide-react';





// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Overview',
      url: '#',
      items: [
        { title: 'Dashboard', url: '/admin-dashboard' },
        { title: 'List of Users', url: '/admin-dashboard/users' },
        { title: 'Lockers', url: '/admin-dashboard/lockers' },
        { title: 'Reservations', url: '/admin-dashboard/reserve_locker' },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
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
                    <SidebarMenuButton asChild isActive={pathname === childItem.url}>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.photoURL || ''} alt={currentUser?.displayName || ''} />
                <AvatarFallback>{currentUser?.displayName?.slice(0, 2)?.toUpperCase() || 'NA'}</AvatarFallback>
              </Avatar>
              <div className="text-left text-sm">
                <span className="block font-semibold">{currentUser?.displayName || 'Guest'}</span>
                <span className="block text-xs">{currentUser?.email || ''}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}