"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { User, onAuthStateChanged } from "firebase/auth"
import { ref, onValue, off } from "firebase/database"
import { decodeUserId } from "@/app/utils/id-encoder"
import { auth, database } from "@/lib/firebase" // Changed 'db' to 'database'
import { AppSidebar } from "../components/app-sidebar"
import { ChartAreaInteractive } from "../components/chart-area-interactive"
import { DataTable } from "../components/data-table"
import { SectionCards } from "../components/section-cards"
import { SiteHeader } from "../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"

export default function BoardPage() {
  const params = useParams<{ userId: string }>()
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let userRef: any;
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        if (!params.userId) {
          router.push("/getin");
          return;
        }

        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.push("/getin");
            return;
          }

          try {
            const decodedUserId = decodeUserId(params.userId);
            
            if (user.uid !== decodedUserId) {
              router.push("/getin");
              return;
            }

            setUserDetails(user);

            userRef = ref(database, `users/${decodedUserId}`); // Changed 'db' to 'database'
            onValue(userRef, (snapshot) => {
              const userData = snapshot.val();
              if (userData) {
                setUserDetails(prevUser => ({
                  ...prevUser!,
                  ...userData
                } as User));
              }
              setLoading(false);
              setAuthChecked(true);
            }, (error) => {
              console.error("Database error:", error);
              setLoading(false);
              setAuthChecked(true);
            });

          } catch (error) {
            console.error("Error in auth flow:", error);
            router.push("/getin");
          }
        });

      } catch (error) {
        console.error("Initialize auth error:", error);
        router.push("/getin");
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (userRef) {
        off(userRef);
      }
    };
  }, [params.userId, router]);

  if (!authChecked || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!userDetails) {
    return null
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
  )
}