"use client"

import { AppSidebarProps, UserData } from '../services/interfaces'
import { BarChartIcon, PlusCircleIcon, UserIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from './nav-user'
import { NavMain } from './nav-main'

const defaultData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/board',
      icon: BarChartIcon
    },
    {
      title: 'Add Weight',
      url: '#',
      icon: PlusCircleIcon,
      onClick: (onAddWeight: () => void) => onAddWeight()
    }
  ]
}

export function AppSidebar({ 
  userId, 
  userData, 
  onAddWeight,
  onEditProfile,
  onLogout,
  ...props 
}: AppSidebarProps) {
  const defaultUserData: UserData = {
    displayName: 'Guest User',
    email: 'guest@example.com',
    avatar: '/avatars/default.png',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isNewUser: true
  };

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
                <span className="text-base font-semibold">Eazy Mass</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain 
          items={defaultData.navMain} 
          userId={userId} 
          onAddWeight={onAddWeight}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={userData || defaultUserData}
          onEditProfile={onEditProfile}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
