import { useEffect, useState } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from 'lucide-react'
import useAuthStore from '@/FldrStore/auth';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Toaster } from "@/components/ui/sonner"

function Layout() {
  const [theme, setTheme] = useState(localStorage.getItem('theme'))
  const location = useLocation()
  const { auth: authenticated, permissions, loading, rehydrate } = useAuthStore()
  const currentPath = location.pathname

  useEffect(() => {
    rehydrate()
    // console.log("REHYDRATED NA SYA")
  }, [])

  // console.log("current path:", currentPath)

  // Apply theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [theme])

  // toggle mode
  const toggleMode = () => {
    const htmlElement = document.documentElement;

    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light')
      htmlElement.style.setProperty("--sidebar", 'oklch(0.985 0.001 106.423)');
      localStorage.setItem('color', 'oklch(0.985 0.001 106.423)');
      htmlElement.style.setProperty("--sidebar-foreground", 'oklch(0.147 0.004 49.25)');
      localStorage.setItem('text', 'oklch(0.147 0.004 49.25)');
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark')
      htmlElement.style.setProperty("--sidebar", 'oklch(0.216 0.006 56.043)');
      localStorage.setItem('color', 'oklch(0.216 0.006 56.043)');
      htmlElement.style.setProperty("--sidebar-foreground", 'oklch(0.985 0.001 106.423)');
      localStorage.setItem('text', 'oklch(0.985 0.001 106.423)');
    }
  }

const publicRoutes = ['/login', '/unauthorize']

if (publicRoutes.includes(currentPath)) {
  return <Outlet />
}

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-lg font-semibold">Loading...</span>
    </div>
  )
}

if (!authenticated) {
  return <Navigate to='/login' />
}

if (!permissions.includes(currentPath)) {
  return <Navigate to="/unauthorize" />
}

  return (
    <SidebarProvider>
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
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
