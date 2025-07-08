'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, BarChart, Settings, LogOut, Database } from "lucide-react";
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/chat", label: "AI Chat", icon: MessageSquare },
    { href: "/simulations", label: "Simulations", icon: BarChart },
    { href: "/data", label: "Manage Data", icon: Database },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <Sidebar collapsible="icon" className="border-r bg-card" variant="sidebar">
            <SidebarHeader>
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
                        <SidebarMenuButton asChild tooltip="Settings">
                            <Link href="#">
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
