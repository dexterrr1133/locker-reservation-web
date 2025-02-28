"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/features/toggle-light-dark-mode";
import { useTheme } from "next-themes"; // Import useTheme

const Header = () => {
  interface User {
    email: string | null;
    // Add other user properties if needed
  }
  const { theme } = useTheme(); // Get the current theme

  // Debugging: Log the current theme
  useEffect(() => {
    console.log("Current theme:", theme);
  }, [theme]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      router.push("/home"); // Redirect to /home after sign-out
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error during sign-out:", err.message);
      } else {
        console.error("Error during sign-out:", err);
      }
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/home" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              src={theme === "light" ? "/locker_icon.png" : "/locker_icon_w.png"}
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
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            aria-label="Open main menu"
          >
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Lockers Dropdown for Desktop */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/admin"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/reserve_locker"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Reservation
          </Link>
          <Link
            href="/FAQ"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            FAQ&#39;s
          </Link>
        </div>

        {/* User Authentication Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <ModeToggle />
          {currentUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="h-10 flex items-center justify-center">
                    <Avatar className="w-full h-full rounded-full overflow-hidden focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="flex items-center justify-center bg-gray-300 text-black text-lg font-semibold focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none active:ring-0">
                        CN
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <span className="text-sm font-semibold pr-4">
                      {currentUser.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleSignOut}>Sign Out</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 pr-4"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 p-4">
          <div className="space-y-4">
            <Link
              href="/admin"
              className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/reserve_locker"
              className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Reservation
            </Link>
            <Link
              href="/FAQ"
              className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              FAQ&#39;s
            </Link>

            {currentUser ? (
              <>
                <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                >
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
