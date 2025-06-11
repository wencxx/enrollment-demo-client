import {
  type LucideIcon,
} from "lucide-react"

import { NavLink, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel
} from "@/components/ui/sidebar"

export function SingleMenu({
  data,
  title,
}: {
  data: {                                                              
    name: string
    url: string
    icon: LucideIcon,
  }[],
  title?: string
}) {

  const location = useLocation()

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <NavLink to={item.url} className={`${item.url === location.pathname.slice(1) && 'bg-sidebar-accent text-sidebar-accent-foreground'}`}>
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
