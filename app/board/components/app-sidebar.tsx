"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { userService } from "../services/user.service"
import { NavDocuments } from "../components/nav-documents"
import { NavMain } from "../components/nav-main"
import { NavSecondary } from "../components/nav-secondary"
import { NavUser } from "../components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface FirebaseUserData {
  displayName: string;
  email: string;
  dateOfBirth: string;
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  isNewUser: boolean;
}

interface UserData {
  name: string;
  email: string;
  dateOfBirth?: string;
  avatar?: string;
  lastLogin: string;
  createdAt?: string;
  isNewUser?: boolean;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userId: string;
}

interface NavUserDisplayData {
  name: string;
  email: string;
  avatar: string;
}

const defaultData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/board",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Weight History",
      url: "/history",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    }
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
  navSecondary: []
}

export function AppSidebar({ userId, ...props }: AppSidebarProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.fetchUserData(userId);
        if (data) {
          const formattedData: UserData = {
            name: data.displayName,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            avatar: data.avatar,
            lastLogin: data.lastLogin,
            createdAt: data.createdAt,
            isNewUser: data.isNewUser
          };
          setUserData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set default user data on error
        setUserData({
          name: 'Guest User',
          email: '',
          avatar: '/avatars/default.png',
          lastLogin: new Date().toISOString(),
          isNewUser: true
        });
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getUserDisplayData = (): NavUserDisplayData => ({
    name: userData?.name || 'Guest User',
    email: userData?.email || '',
    avatar: userData?.avatar || '/avatars/default.png'
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/board">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Eazy Mass</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={defaultData.navMain} userId={userId} />
        <NavDocuments items={defaultData.documents} />
        <NavSecondary items={defaultData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={getUserDisplayData()} />
      </SidebarFooter>
    </Sidebar>
  );
}
