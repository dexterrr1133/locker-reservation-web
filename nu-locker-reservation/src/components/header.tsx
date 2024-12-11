"use client";
import { HOME_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, SIGNUP_ROUTE, DASHBOARD_ROUTE } from "@/app/constants/routes";
import Link from "next/link";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Header = () => {
    return (
        <header className="h-20 bg-gradient-to-br from-yellow-400/20 via-blue-300 to-purple-400/60 flex px-10 drop-shadow-[0px_2px_10px_rgba(2,0,0) text-black">
            <nav className="w-full mx-auto flex justify-between items-center px-2 text-black font-serif text-xl">
                <Link href={HOME_ROUTE}><div>Logo</div></Link>
                <ul className="flex gap-4">
                        <>
                            <Link href={LOGIN_ROUTE}><li>Login</li></Link>
                            <Link href={SIGNUP_ROUTE}><li>SignUp</li></Link>
                        </>
                        <>
                            <Link href={PROFILE_ROUTE}><li>Profile</li></Link>
                            <Link href={DASHBOARD_ROUTE}><li>Admin</li></Link>
                            <li className=" cursor-pointer">Logout</li>
                        </>
                </ul>
            </nav>
        </header>
    )
}

export default Header;