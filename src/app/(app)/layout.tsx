import type { PropsWithChildren } from "react";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-secondary">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
