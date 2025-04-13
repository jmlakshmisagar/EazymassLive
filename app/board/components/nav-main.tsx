"use client"

import { useState } from "react"
import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { GetWeight } from "./get-weight"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  userId,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
  userId: string
}) {
  const [showGetWeight, setShowGetWeight] = useState(false)

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                onClick={() => setShowGetWeight(true)}
              >
                <PlusCircleIcon />
                <span>Add Eazy Weight</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <GetWeight 
        open={showGetWeight} 
        onOpenChange={setShowGetWeight}
        userId={userId}
      />
    </>
  )
}
