'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  { name: 'Tall Lockers', description: 'Your customers’ data will be safe and secure', href: "/tall_lockers", icon: ChevronDownIcon },
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

  // Listen to user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
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
      setCurrentUser(null); // Update state immediately after sign-out
      router.push('/home'); // Redirect to /home after sign-out
    } catch (err: any) {
      console.error('Error during sign-out:', err.message);
    }
  };

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
              <DropdownMenuTrigger>Icon</DropdownMenuTrigger>
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
