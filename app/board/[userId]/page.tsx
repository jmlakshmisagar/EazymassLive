"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { User, onAuthStateChanged } from "firebase/auth"
import { decodeUserId, isValidUserId } from "@/app/utils/id-encoder"
import { getUserData } from "@/app/getin/services/user.service"
import { auth } from "@/lib/firebase"
import { AppSidebar } from "../components/app-sidebar"
import { ChartAreaInteractive } from "../components/chart-area-interactive"
import { DataTable } from "../components/data-table"
import { SectionCards } from "../components/section-cards"
import { SiteHeader } from "../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface UserDetails extends User {
  dateOfBirth: string;
  gender: string;
  isNewUser: boolean;
}

export default function BoardPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.userId) {
      router.push("/getin");
      return;
    }

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
  }, [params.userId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return <div>User not found</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">
          <SiteHeader userDetails={userDetails} />
          <div className="container mx-auto p-6">
            <SectionCards />
            <div className="mt-6">
              <ChartAreaInteractive />
            </div>
            <div className="mt-6">
              <DataTable data={[]} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}