import { useEffect, useState } from "react";
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useAuthStore from "@/FldrStore/auth"

type Theme = {
  color: string; 
  background: string;
  text: string;
}

const colorTheme: Theme[] = [
  {
    color: 'red',
    background: 'oklch(0.637 0.237 25.331)',
    text: 'white'
  },
  {
    color: 'blue',
    background: 'oklch(0.623 0.214 259.815)',
    text: 'white'
  },
  {
    color: 'yellow',
    background: 'oklch(0.795 0.184 86.047)',
    text: 'white'
  },
  {
    color: 'green',
    background: 'oklch(0.723 0.219 149.579)',
    text: 'white'
  },
  {
    color: 'orange',
    background: 'oklch(0.705 0.213 47.604)',
    text: 'white'
  },
  {
    color: 'violet',
    background: 'oklch(0.606 0.25 292.717)',
    text: 'white'
  },
  {
    color: 'teal',
    background: 'oklch(0.704 0.14 182.503)',
    text: 'white'
  },
  {
    color: 'pink',
    background: 'oklch(0.656 0.241 354.308)',
    text: 'white'
  },
  {
    color: 'cyan',
    background: 'oklch(0.715 0.143 215.221)',
    text: 'white'
  },
  {
    color: 'lime',
    background: 'oklch(0.768 0.233 130.85)',
    text: 'white'
  },
  {
    color: 'rose',
    background: 'oklch(0.645 0.246 16.439)',
    text: 'white'
  },
  {
    color: 'amber',
    background: 'oklch(0.769 0.188 70.08)',
    text: 'white'
  },
  {
    color: 'emerald',
    background: 'oklch(0.696 0.17 162.48)',
    text: 'white'
  },
]

export function NavUser() {
  const { isMobile } = useSidebar()
  const store = useAuthStore()
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const user = store.currentUser

  const handleLogout = () => {
    store.logout()
  }

  const handleThemeChange = (color?: string, text?: string) => {
    const htmlElement = document.documentElement;

    if(color && text){
      htmlElement.style.setProperty("--sidebar", color);
      localStorage.setItem('color', color); 
      htmlElement.style.setProperty("--sidebar-foreground", text);
      localStorage.setItem('text', text); 
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); 
    }
  }

  useEffect(() => {
    const color = localStorage.getItem('color');
    const text = localStorage.getItem('text');

    if(color){
      document.documentElement.style.setProperty("--sidebar", color);
      document.documentElement.style.setProperty("--sidebar-foreground", text);
    }
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user && (
                <Avatar className="h-8 w-8 rounded-lg !text-black dark:!text-white">
                  <AvatarImage src={user?.groupName} alt={user?.groupName} />
                  <AvatarFallback className="rounded-lg uppercase">{user.fullName ? user.fullName.split(' ')[0].slice(0, 1) + user.fullName.split(' ')[1].slice(0, 1) : ''}</AvatarFallback>
                </Avatar>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold capitalize">{user?.fullName}</span>
                <span className="truncate text-xs">@{user?.userName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user && (
                  <Avatar className="h-8 w-8 rounded-lg !text-black dark:!text-white">
                    <AvatarImage src={user?.groupCode} alt={user?.groupCode} />
                    <AvatarFallback className="rounded-lg uppercase">{user.fullName ? user.fullName.split(' ')[0].slice(0, 1) + user.fullName.split(' ')[1].slice(0, 1) : 'WB'}</AvatarFallback>
                  </Avatar>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.fullName}</span>
                  <span className="truncate text-xs">@{user?.userName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* logout alert dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-500 text-white">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* settings sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle className="uppercase">Settings</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4 px-4">
            <div className="space-y-3">   
              <p>Themes</p> 
              <Input placeholder="Input color" onChange={(e) => handleThemeChange(e.target.value)} />
              <div className="flex flex-wrap gap-3">
                {colorTheme.map((theme, index) => (
                  <div
                    key={index}
                    className={`w-8 aspect-square rounded cursor-pointer`}
                    style={{ backgroundColor: theme.background }}
                    onClick={() => handleThemeChange(theme.background, theme.text)}
                  />
                ))}
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </SidebarMenu>
  )
}
