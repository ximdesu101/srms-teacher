import {
    LayoutDashboard,
    FileText,
    FilePlusCorner,
    Bell,
    Send,
} from "lucide-react";

import { NavMain } from "@/components/layout/sidebar/sidebar-layout/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarRail,
} from '@/components/ui/sidebar';

const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    {
        title: "Document Requests",
        url: "#",
        icon: FilePlusCorner,
        items: [
            { title: "Create Request", url: "/create-request" },
        ],
    },
    { title: "Submission Requests", url: "/submission-requests", icon: Send },
    { title: "Notifications", url: "/notifications", icon: Bell },
];

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent className="mt-15">
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}