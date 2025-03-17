import * as React from "react"
import {
  FileInput,
  ChartColumn,
  FileUser,
  User,
  ClipboardList
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { MenuMain } from "@/components/FldrMenu/menu-main"
import { SingleMenu } from "@/components/FldrMenu/menu-single"
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
  menuStudent: [
    {
      name: 'Profile',
      url: 'student/profile',
      icon: User,
    },
    {
      name: 'Application',
      url: 'student/application',
      icon: FileUser,
    },
    {
      name: 'Grades',
      url: 'student/grades',
      icon: ClipboardList,
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
          title: "Rate Course",
          url: "entry/ratecourse",
          authorizeUsers: ['Admin']
        },
      ],
    },
    {
      title: "Enrollment",
      url: "#",
      icon: FileUser,
      authorizeUsers: ['Admin'],
      items: [
        {
          title: "Enrollment - 1",
          url: "enrollment/enrollment1",
          authorizeUsers: ['Admin']
        },
        {
          title: "Enrollment - 2",
          url: "enrollment/enrollment2",
          authorizeUsers: ['Admin']
        },
        {
          title: "Enrollment - 3",
          url: "enrollment/enrollment3",
          authorizeUsers: ['Admin']
        },
      ],
    }
  ],
  // menuEnrollment: [
  //   {
  //     name: 'Enrollment1',
  //     url: 'enrollment/enrollment1',
  //     icon: ChartColumn,
  //     authorizeUsers: ['Admin']
  //   },
  //   {
  //     name: 'Enrollment2',
  //     url: 'enrollment/enrollment1',
  //     icon: ChartColumn,
  //     authorizeUsers: ['Admin']
  //   },
  //   {
  //     name: 'Enrollment3',
  //     url: 'enrollment/enrollment1',
  //     icon: ChartColumn,
  //     authorizeUsers: ['Admin']
  //   }
  // ],
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
        { (user && (user.groupName === 'Admin')) && <SingleMenu data={data.menuDashboard} /> }
        { (user && (user.groupName === 'Admin')) && <SingleMenu data={data.menuStudent} title="Student" /> }
        {/* { (user && (user.groupName === 'Admin')) && <MenuEnrollment dashboard={data.menuEnrollment} /> } */}
        { (user && (user.groupName === 'Admin')) && <MenuMain items={data.menuMain} /> }
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
