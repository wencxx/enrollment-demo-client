import {
  type LucideIcon,
} from "lucide-react"

import { NavLink } from "react-router-dom"
import useAuthStore from "@/FldrStore/auth"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel
} from "@/components/ui/sidebar"

export function MenuEnrollment({
  dashboard,
}: {
  dashboard: {
    name: string
    url: string
    icon: LucideIcon,
    authorizeUsers: string[],
  }[]
}) {

  const store = useAuthStore()

  const user = store.currentUser

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Enrollment</SidebarGroupLabel>
      <SidebarMenu>
        {dashboard.map((item) => (
          <SidebarMenuItem className={`${user && !item.authorizeUsers?.includes(user.groupName) && 'hidden' }`} key={item.name}>
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
