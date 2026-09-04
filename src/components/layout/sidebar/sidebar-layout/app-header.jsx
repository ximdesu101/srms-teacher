import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import Logo from "@/assets/Logo.png";
import { Link } from "react-router-dom";
export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-[#0b7a3b] h-16 px-6 shadow-md shrink-0">
            <div className="h-full flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-4">

                    <img
                        src={Logo}
                        alt="School Logo"
                        className="h-12 w-12 rounded-full object-cover"
                    />

                    <div className="leading-tight">
                        <h1 className="text-white text-[22px] font-medium">
                            Tagnao Elementary School
                        </h1>

                        <p className="text-green-100 text-xs">
                            School Records Management System
                        </p>
                    </div>

                </div>

                {/* Right */}
                <div className="flex items-center">

                    {/* Profile */}
                    <div className="flex items-center gap-3 pr-6">

                        <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarFallback className="text-sm bg-transparent text-white">TC</AvatarFallback>
                        </Avatar>

                        <div className="leading-tight">
                            <h2 className="text-white text-sm font-medium">
                                Tom Ribert Calinao
                            </h2>

                            <p className="text-green-100 text-xs">
                                Admin
                            </p>
                        </div>

                    </div>

                    {/* Divider */}
                    <div className="h-10 w-px bg-green-300/60"></div>

                    {/* Notification */}
                    <button className="relative ml-6 text-white hover:text-gray-200 transition">
                        <Link to="/notifications">

                            <Bell size={24} strokeWidth={2} />
                        </Link>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold">
                            3
                        </span>

                    </button>

                </div>

            </div>
        </header>
    );
}