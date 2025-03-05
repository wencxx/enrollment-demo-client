import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sun } from 'lucide-react'

function Layout() {

  // toggle mode
  const toggleMode = () => {
    const htmlElement = document.documentElement;

    if (htmlElement.classList.contains('dark')) {
  
      htmlElement.classList.remove('dark');
  
    } else {
  
      htmlElement.classList.add('dark');
  
    }
  }

  return (
    <SidebarProvider  >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Button size='sm' variant='ghost' onClick={toggleMode}>
              <Sun />
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
