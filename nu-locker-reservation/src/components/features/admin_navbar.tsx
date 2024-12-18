import Image from "next/image";
import Link from "next/link";
import logo from "./../../../public/locker_icon.png";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";


const Nav = () => {
    return (
        <div className="bg-primary dark:bg-slate-700 text-white py-2 px5 flex justify-between">
           <Link href='/'>
                <Image src={logo} alt='AAAAAAAA' width={40}/>
        
           </Link>
           <Avatar>
                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn'/>
                    <AvatarFallback className='text-black'>BT</AvatarFallback>
            </Avatar>
        </div>
    );

};
export default Nav;