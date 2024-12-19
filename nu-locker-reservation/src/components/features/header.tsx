'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const lockers = [
  { name: 'Small Lockers', description: 'Get a better understanding of your traffic', href: "/small_lockers", icon: ChevronDownIcon },
  { name: 'Medium Lockers', description: 'Speak directly to your customers', href: "/medium_lockers", icon: ChevronDownIcon },
  { name: 'Tall Lockers', description: 'Your customers data will be safe and secure', href: "/tall_lockers", icon: ChevronDownIcon },
];

const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
];

const Header = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  // Check for session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      // Use the server action for logout
  
      
      // Reset local state
      setCurrentUser(null);
      
      // Redirect to login page
      router.push('/login');
    } catch (err: any) {
      console.error('Error during sign-out:', err.message);
    }
  };

  // Render loading state if needed
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/home" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              src="/locker_icon.png"
              alt="Locker Icon"
              width={320}
              height={320}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Lockers Dropdown for Desktop */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/page_visit_admin" className="text-sm font-semibold text-gray-900">
            Admin Dashboard
          </Link>
          <Link href="/reserve_locker" className="text-sm font-semibold text-gray-900">
            Reservation
          </Link>
          <Link href="/FAQ" className="text-sm font-semibold text-gray-900">
            FAQ'S
          </Link>
        </div>

        {/* User Authentication Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {currentUser ? (
            <>
              <DropdownMenu>
              <DropdownMenuTrigger>
              <div className="h-10 flex items-center justify-center ">
              <Avatar
                className="w-full h-full rounded-full overflow-hidden focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0"
              >
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback
                  className="flex items-center justify-center bg-gray-300 text-black text-lg font-semibold focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0"
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'CN'}
                </AvatarFallback>
              </Avatar>
              </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                <span className="text-sm font-semibold text-gray-900 pr-4">
                  {currentUser.email}
                </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                <button
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-900 pr-4">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-semibold text-gray-900">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-4 p-4">
            <Link href="/admin" className="text-sm font-semibold text-gray-900">
              Admin Dashboard
            </Link>
            <Link href="/reserve_locker" className="text-sm font-semibold text-gray-900">
              Reservation
            </Link>
            <Link href="#" className="text-sm font-semibold text-gray-900">
              FAQ'S
            </Link>

            {currentUser ? (
              <>
                <span className="text-sm font-semibold text-gray-900 pr-4">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-900 pr-4">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-semibold text-gray-900">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;