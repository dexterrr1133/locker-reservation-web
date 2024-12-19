import Image from "next/image";
import Link from "next/link";
import logo from "./../../../public/locker_icon.png";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserNav } from "./user-nav";
import { Separator } from "../ui/separator";
import { Breadcrumbs } from "./breadcrumbs";
import { SidebarTrigger } from "../ui/sidebar";
import  SearchInput  from "./search-input";


const Nav = () => {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs/>
          </div>
    
          <div className="flex items-center gap-2 px-4">
            <div className="hidden md:flex">
              <SearchInput />
            </div>
            <UserNav />
            
          </div>
        </header>
      );

};
export default Nav;