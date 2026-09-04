import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileUp,
    Logs,
    RouteOff,
    FolderSync,
    ShieldCheck,
    Activity,
    UserRoundCog,
    ChartNoAxesCombined,
    Settings2,
    LogOut,
    Loader2,
    BellElectric,
    FileText,
    FilePlusCorner,
    Send 
} from "lucide-react";

import { NavMain } from "@/components/layout/sidebar/sidebar-layout/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';

const navMain = [
    { title: "Dashboard", url: "#", icon: LayoutDashboard },
    {
        title: "Document Requests",
        url: "#",
        icon: Users,
        items: [
            { title: "Create Request", url: "/create-request" },
            { title: "My Documents", url: "#" },
        ],

    },
    { title: "Submission", url: "#", icon: FileText },
    { title: "Document History", url: "#", icon: FileText },
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