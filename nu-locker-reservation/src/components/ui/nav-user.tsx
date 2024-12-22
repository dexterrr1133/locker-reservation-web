"use client"

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type User = {
    name: string
    email: string
    avatar: string
}

export function NavUser() {
  const { isMobile } = useSidebar()

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const router = useRouter();
  
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              name: firebaseUser.displayName || "Anonymous",
              email: firebaseUser.email || "No email",
              avatar: firebaseUser.photoURL || "/default-avatar.png",
            });
          } else {
            setUser(null);
          }
          setLoading(false); // Stop loading when authentication state is resolved
        });
    
        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
      }, []);
    
      // Handle sign-out
      const handleSignOut = async () => {
        try {
          await signOut(auth);
          setUser(null); // Update state immediately after sign-out
          router.push("/home"); // Redirect to /home after sign-out
        } catch (err: any) {
          console.error("Error during sign-out:", err.message);
        }
      };
  

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
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
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}