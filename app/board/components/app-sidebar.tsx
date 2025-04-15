"use client"

import { AppSidebarProps, UserData, } from '../services/interfaces'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { defaultData } from '../config/sidebar-data'
import { NavUser } from './nav-user'
import { NavMain } from './nav-main'

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
    email: '',
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
