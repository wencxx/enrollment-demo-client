import { useEffect, useState } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from 'lucide-react'
import useAuthStore from '@/FldrStore/auth';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function Layout() {
  const [theme, setTheme] = useState(localStorage.getItem('theme'))

  const location = useLocation()

  // toggle mode
  const toggleMode = () => {
    const htmlElement = document.documentElement;

    htmlElement.style.removeProperty("--sidebar");
    htmlElement.style.removeProperty("--sidebar-foreground");
    htmlElement.style.removeProperty("--primary");
    htmlElement.style.removeProperty("--chart-1");
    htmlElement.style.removeProperty("--chart-2");

    localStorage.removeItem('color');
    localStorage.removeItem('primary');
    localStorage.removeItem('chart1');
    localStorage.removeItem('chart2');
    localStorage.removeItem('text');

    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light')
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark')
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // check if authenticated
  const store = useAuthStore()
  const authenticated = store.auth
  const user = store.currentUser

  // Check if the user is authorized to access the current route
  const isAuthorized = () => {
    const path = location.pathname.split('/')[2] || '/'
    const authorizedPaths: Record<string, string[]> = {
      'Admin': ['course', 'student', 'rate', 'enrollment1', 'enrollment2', 'ratecourse', '/', 'grades', 'profile'],
      // Students should not access enrollment
      'Student': ['application', 'grades', 'profile']
    }
    return user && authorizedPaths[user.groupName]?.includes(path)
  }

  if (!authenticated) return <Navigate to='/login' />
  if (!isAuthorized()) return <Navigate to='/unauthorize' />

  return (
    <SidebarProvider  >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <div className='flex items-center gap-x-2'>
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb className='capitalize'>
                <BreadcrumbList>
                  {location.pathname.split('/')[1] && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink>
                          Main
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </>
                  )}
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink>
                      {location.pathname.split('/')[1] || 'Dashboard'}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {location.pathname.split('/')[1] && <BreadcrumbSeparator className="hidden md:block" />}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{location.pathname.split('/')[2] || null}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button size='sm' variant='ghost' onClick={toggleMode}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>
        <main className="w-full h-full p-5">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
