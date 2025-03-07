import * as React from "react"
import {
  FileInput,
  ChartColumn
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { MenuMain } from "@/components/FldrMenu/menu-main"
import { MenuDashboard } from "@/components/FldrMenu/menu-dashboard"
// import { NavProjects } from "@/components/FldrMenu/nav-projects"
import { NavUser } from "@/components/FldrMenu/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import useAuthStore from "@/FldrStore/auth"

// menu lists
const data = {
  menuDashboard: [
    {
      name: 'Dashboard',
      url: '/',
      icon: ChartColumn,
    }
  ],
  menuMain: [
    {
      title: "Entry",
      url: "#",
      icon: FileInput,
      authorizeUsers: ['Admin'],
      items: [
        {
          title: "Student",
          url: "entry/student",
          authorizeUsers: ['Admin']
        },
        {
          title: "Course",
          url: "entry/course",
          authorizeUsers: ['Admin']
        },
        {
          title: "Rate",
          url: "entry/rate",
          authorizeUsers: ['Admin']
        },
        {
          title: "Rate Type",
          url: "#",
          authorizeUsers: ['Student']
        },
        {
          title: "Enroll Status",
          url: "#",
          authorizeUsers: ['Student', 'Admin']
        },
        {
          title: "Semester",
          url: "#",
          authorizeUsers: ['Student']
        },
        {
          title: "Year",
          url: "#",
          authorizeUsers: ['Admin']
        },
        {
          title: "Enrollment 1",
          url: "entry/enrollment1",
          authorizeUsers: ['Admin']
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const store = useAuthStore()
  const user = store.currentUser
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                  <Avatar className="rounded-lg">
                    <AvatarImage src='/cbytelogo.jpg' alt='logo' />
                    <AvatarFallback className="rounded-lg">CB</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                    Cbyte programming
                </span>
                <span className="truncate text-xs">Enterprise</span>
                </div>
            </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        { (user && (user.groupName === 'Admin')) && <MenuDashboard dashboard={data.menuDashboard} /> }
        { (user && (user.groupName === 'Admin'  || user.groupName === 'Student')) && <MenuMain items={data.menuMain} /> }
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
