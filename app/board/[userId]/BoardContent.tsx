"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "../components/app-sidebar"
import { ChartAreaInteractive } from "../components/chart-area-interactive"
import { DataTable } from "../components/data-table"
import { SectionCards } from "../components/section-cards"
import { SiteHeader } from "../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { userService } from "../services"
import { UserData, WeightEntry } from '../services/interfaces'
import { ServiceError } from '../services/core/errors'
import { CacheService } from "../services/cache/cache.service"
import { GetWeight } from "../components/get-weight"
import EditProfile from "../components/edit-profile"
import { toast } from "sonner"

export default function BoardContent({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const cachedData = await CacheService.getCachedData(userId);
      
      if (cachedData) {
        setUserData(cachedData);
        setWeightData(cachedData.weights || []);
        return;
      }

      const profile = await userService.getUserProfile(userId);
      if (!profile) {
        toast.error('User profile not found. Please set up your profile.');
        setUserData(null);
        return;
      }

      setUserData(profile);
      setWeightData(profile.weights || []);
      await CacheService.setCachedData(userId, profile);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error instanceof ServiceError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleWeightAdded = async () => {
    await fetchData();
    setShowWeightForm(false);
    toast.success('Weight added successfully');
  };

  const handleProfileUpdated = async () => {
    await fetchData();
    setShowEditProfile(false);
    toast.success('Profile updated successfully');
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
      await CacheService.clearCache(userId);
      window.location.href = '/login';
    } catch (error) {
      if (error instanceof ServiceError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to logout');
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        userId={userId} 
        userData={userData}
        onAddWeight={() => setShowWeightForm(true)}
        onEditProfile={() => setShowEditProfile(true)}
        onLogout={handleLogout}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards 
                weightData={weightData} 
                isLoading={isLoading}
                onAddWeight={() => setShowWeightForm(true)}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive 
                  data={weightData} 
                  isLoading={isLoading} 
                />
              </div>
              <DataTable 
                data={weightData} 
                isLoading={isLoading}
              /> */}
            </div>
          </div>
        </div>
      </SidebarInset>

      <GetWeight 
        open={showWeightForm}
        onOpenChange={setShowWeightForm}
        userId={userId}
        onWeightAdded={handleWeightAdded}
        userHeight={userData?.height}
      />

      <EditProfile
        userId={userId}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </SidebarProvider>
  );
}