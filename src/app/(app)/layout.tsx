'use client';

import type { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { FinancialDataProvider } from "@/hooks/use-financial-data";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logo";

function AuthenticatedLayout({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-6">
                <Logo />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                 <p className="text-muted-foreground">Authenticating...</p>
            </div>
        </div>
    );
  }
  
  return (
    <FinancialDataProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-secondary animate-fade-in">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </FinancialDataProvider>
  );
}


export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </AuthProvider>
  );
}
