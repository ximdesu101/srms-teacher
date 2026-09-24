import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import Logo from "@/assets/Logo.png";
import { Link } from "react-router-dom";
import { GetUnreadCount } from "@/services/notificationService";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const { user } = useAuth?.() || {};
    const { data } = useQuery({
        queryKey: ["unread-count"],
        queryFn: GetUnreadCount,
        refetchInterval: 30000,
        staleTime: 10000,
    });

    const count = data?.count ?? 0;
    const initials = user
        ? `${(user.first_name?.[0] || "")}${(user.last_name?.[0] || "")}`.toUpperCase() || "TC"
        : "TC";
    const displayName = user
        ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username
        : "Teacher";

    return (
        <header className="sticky top-0 z-50 bg-[#0b7a3b] h-16 px-6 shadow-md shrink-0">
            <div className="h-full flex items-center justify-between">
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

                <div className="flex items-center">
                    <div className="flex items-center gap-3 pr-6">
                        <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarFallback className="text-sm bg-transparent text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                            <h2 className="text-white text-sm font-medium">
                                {displayName}
                            </h2>
                            <p className="text-green-100 text-xs">Teacher</p>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-green-300/60"></div>

                    <Link
                        to="/notifications"
                        className="relative ml-6 text-white hover:text-gray-200 transition"
                    >
                        <Bell size={24} strokeWidth={2} />
                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-0.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold">
                                {count > 99 ? "99+" : count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}