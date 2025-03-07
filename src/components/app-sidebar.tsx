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

// menu lists
const data = {
  user: {
    name: "cbyte",
    email: "cbyteprog@gmail.com",
    avatar: "/cbytelogo.jpg",
  },
  menuDashboard: [
    {
      name: 'Dashboard',
      url: '/',
      icon: ChartColumn
    }
  ],
  menuMain: [
    {
      title: "Entry",
      url: "#",
      icon: FileInput,
      items: [
        {
          title: "Students",
          url: "entry/student",
        },
        {
          title: "Course",
          url: "entry/course",
        },
        {
          title: "Rate",
          url: "#",
        },
        {
          title: "Enrollment1",
          url: "entry/enrollment1",
        },
        {
          title: "Rate Type",
          url: "#",
        },
        {
          title: "Enroll Status",
          url: "#",
        },
        {
          title: "Semester",
          url: "#",
        },
        {
          title: "Year",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                    Cbyte Programming
                </span>
                <span className="truncate text-xs">Enterprise</span>
                </div>
            </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <MenuDashboard dashboard={data.menuDashboard} />
        <MenuMain items={data.menuMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
