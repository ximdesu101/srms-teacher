import { AppSidebar } from "@/components/layout/sidebar/sidebar-layout/app-sidebar"
import { Outlet } from 'react-router-dom'
import {
    SidebarInset,
    SidebarProvider,
} from '@/components/ui/sidebar'
import AppBreadcrumbs from "./sidebar-layout/app-breadcrumb"
import Header from "./sidebar-layout/app-header"

function Sidebar() {
    return (
        <div className="flex h-svh flex-col overflow-hidden">
            <Header />

            <SidebarProvider className="flex-1 min-h-0">
                <AppSidebar />
                <SidebarInset className="overflow-hidden flex flex-col">
                    <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                        <header className="flex h-12 shrink-0 items-center gap-2">
                            <div className="flex items-center gap-2">
                                <AppBreadcrumbs />
                            </div>
                        </header>

                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default Sidebar