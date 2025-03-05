import * as React from "react"
import {
  GalleryVerticalEnd,
  FileInput,
  ChartColumn
} from "lucide-react"

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
    name: "wency",
    email: "wncbtrn@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  menuDashboard: [
    {
      name: 'Dashboard',
      url: '/dean',
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
          title: "Course",
          url: "/dean/course",
        },
        {
          title: "Rate",
          url: "/dean/rate",
        },
        {
          title: "Rate Type",
          url: "#",
        },
        {
          title: "Students",
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
    <Sidebar collapsible="icon" {...props} className="!bg-red-500">
      <SidebarHeader>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
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
