"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { getUserData } from "@/app/getin/services/user.service";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "./components/app-sidebar";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { DataTable } from "./components/data-table";
import { SectionCards } from "./components/section-cards";
import { SiteHeader } from "./components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import data from "./[userId]/data.json";

interface UserDetails extends User {
  dateOfBirth: string;
  gender: string;
  isNewUser: boolean;
}

export default function BoardPage() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUid = localStorage.getItem('originalUid');
    if (!storedUid) {
      router.push("/getin");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/getin");
        return;
      }

      try {
        const userData = await getUserData(storedUid);
        if (userData) {
          setUserDetails({
            ...user,
            ...userData
          } as UserDetails);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/getin");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Please log in to access the dashboard</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader userDetails={userDetails} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
