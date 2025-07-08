'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Calculator, BarChart, Database, LogOut, Settings, Target } from "lucide-react";
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chat", label: "AI Assistant", icon: MessageSquare },
    { href: "/simulations", label: "Simulation", icon: Calculator },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/data", label: "Manage Data", icon: Database },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="p-4">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="p-2">
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                tooltip={item.label}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu className="p-2">
                     <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith('/settings')}
                            tooltip="Settings"
                        >
                            <Link href="/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton onClick={signOut} tooltip="Logout">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
