'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, BarChart, Settings, LifeBuoy, LogOut } from "lucide-react";
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { Button } from "./ui/button";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/chat", label: "AI Chat", icon: MessageSquare },
    { href: "/simulations", label: "Simulations", icon: BarChart },
];

export default function AppSidebar() {
    const pathname = usePathname();

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
                                isActive={pathname === item.href}
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
                        <SidebarMenuButton asChild tooltip="Logout">
                            <Link href="/login">
                                <LogOut />
                                <span>Logout</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
