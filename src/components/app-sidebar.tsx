import * as React from "react"
import {
  FileInput,
  ChartColumn,
  FileUser,
  User,
  Users,
  KeyRound,
  Route,
  ClipboardList,
  ReceiptText,
  Calendar1
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
import { MenuEnrollment } from "./FldrMenu/menu-enrollment"

// menu lists
const data = {
  menuDashboard: [
    {
      name: 'Dashboard',
      url: '/',
      icon: ChartColumn,
    },
    {
      name: 'Schedules',
      url: '/schedules',
      icon: Calendar1,
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
    },
    {
      name: 'Statement of Account',
      url: 'student/statement-of-account',
      icon: ReceiptText,
    }
  ],
  menuPersmissions: [
    {
      name: 'Users',
      url: 'permissions/users',
      icon: Users,
    },
    {
      name: 'Grant Permission',
      url: 'permissions/grant-permission',
      icon: KeyRound,
    },
    {
      name: 'Routes',
      url: 'permissions/routes',
      icon: Route,
    },
  ],
  menuMain: [
    {
      title: "Entry",
      url: "#",
      icon: FileInput,
      authorizeUsers: ['Admin'],
      items: [
        {
          title: "Course",
          url: "entry/course",
          authorizeUsers: ['Admin']
        },
        {
          title: "Professors",
          url: "entry/professors",
          authorizeUsers: ['Admin']
        },
        {
          title: "High School",
          url: "entry/highschool",
          authorizeUsers: ['Admin']
        },
        {
          title: "Elementary",
          url: "entry/elementary",
          authorizeUsers: ['Admin']
        },

        {
          title: "Town/City",
          url: "entry/town",
          authorizeUsers: ['Admin']
        },
        {
          title: "Room",
          url: "entry/room",
          authorizeUsers: ['Admin']
        },
        {
          title: "Section",
          url: "entry/section",
          authorizeUsers: ['Admin']
        },
        {
          title: "Rate 1",
          url: "entry/rate1",
          authorizeUsers: ['Admin']
        },
        {
          title: "Rate 2",
          url: "entry/rate2",
          authorizeUsers: ['Admin']
        },
        {
          title: "Rate Description",
          url: "entry/ratedesc",
          authorizeUsers: ['Admin']
        },
        {
          title: "Enroll Description",
          url: "entry/enroll-description",
          authorizeUsers: ['Admin']
        },
      ],
    },
  ],
  menuEnrollment: [
    {
      title: "Enrollment",
      url: "#",
      icon: ChartColumn,
      authorizeUsers: ['Admin'],
      items: [
        {
          title: "Enrollment 1",
          url: "enrollment/enrollment1",
          authorizeUsers: ['Admin']
        },
        {
          title: "Enrollment 2",
          url: "enrollment/enrollment2",
          authorizeUsers: ['Admin']
        },
        {
          title: "Enrollment 3",
          url: "enrollment/enrollment3",
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
              CBytes University
            </span>
            <span className="truncate text-xs">Foundation</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hidden">
        {(user && (user.groupName === 'Admin')) && <SingleMenu data={data.menuDashboard} />}
        {(user && (user.groupName === 'Admin' || user.groupName === 'Student')) && <SingleMenu data={data.menuStudent} title="Student" />}
        {(user && (user.groupName === 'Admin')) && <MenuMain items={data.menuMain} />}
        {(user && (user.groupName === 'Admin')) && <MenuEnrollment items={data.menuEnrollment} /> } 
        {(user && (user.groupName === 'Admin')) && <SingleMenu data={data.menuPersmissions} title="Permissions" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
