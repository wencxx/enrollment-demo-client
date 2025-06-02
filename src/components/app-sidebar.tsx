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
  Calendar1,
  FileDigit
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
// import useAuthStore from "@/FldrStore/auth"
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
    },
    {
      name: 'Students',
      url: '/students',
      icon: User,
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
  menuTeacher: [
    {
      name: 'Manage Grades',
      url: 'teacher/manage-grades',
      icon: FileDigit,
    },
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
      items: [
        {
          title: "College",
          url: "entry/college",
        },
        { 
          title: "Course",
          url: "entry/course",
        },
        // {
        //   title: "Subject",
        //   url: "entry/subject-prerequisite",
        // },
        {
          title: "Professors",
          url: "entry/professors",
        },
        {
          title: "High School",
          url: "entry/highschool",
        },
        {
          title: "Elementary",
          url: "entry/elementary",
        },
        {
          title: "Town/City",
          url: "entry/town",
        },
        {
          title: "Room",
          url: "entry/room",
        },
        {
          title: "Section",
          url: "entry/section",
        },
        {
          title: "Rate 1",
          url: "entry/rate1",
        },
        {
          title: "Rate 2",
          url: "entry/rate2",
        },
        {
          title: "Rate Description",
          url: "entry/ratedesc",
        },
        {
          title: "Enroll Description",
          url: "entry/enroll-description",
        },
        {
          title: "Academic Year",
          url: "entry/AY",
        },
        {
          title: "Semester",
          url: "entry/semester",
        },
      ],
    },
  ],
  menuEnrollment: [
    {
      title: "Enrollment",
      url: "#",
      icon: ChartColumn,
      items: [
        {
          title: "Admissions",
          url: "enrollment/admission",
        },
        {
          title: "Load Subjects",
          url: "enrollment/load-subjects",
        },
        {
          title: "Payments",
          url: "enrollment/payments",
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
              CBytes University
            </span>
            <span className="truncate text-xs">Foundation</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hidden">
        <SingleMenu data={data.menuDashboard} />
        <SingleMenu data={data.menuStudent} title="Student" />
        <SingleMenu data={data.menuTeacher} title="Teacher" />
        <MenuMain items={data.menuMain} />
        <MenuEnrollment items={data.menuEnrollment} />
        <SingleMenu data={data.menuPersmissions} title="Permissions" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
