import {
  type LucideIcon,
} from "lucide-react"

import { NavLink } from "react-router-dom"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function MenuDashboard({
  dashboard,
}: {
  dashboard: {                                                              
    name: string
    url: string
    icon: LucideIcon,
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {dashboard.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <NavLink to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.name}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
