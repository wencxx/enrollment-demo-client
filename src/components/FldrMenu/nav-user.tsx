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
import useAuthStore from "@/FldrStore/auth"
import { debounce } from "lodash";

export function NavUser() {
  const { isMobile } = useSidebar()
  const store = useAuthStore()
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [color, setColor] = useState<string | undefined>(undefined);

  const user = store.currentUser

  const handleLogout = () => {
    store.logout()
    window.location.href = "/login"
  }

  const updateTheme = (color: string) => {
    const htmlElement = document.documentElement;
    const isDark = checkIfDarkColor(color);
    const text = isDark ? 'white' : 'black';
    const hsl = hexToHSL(color);

    requestAnimationFrame(() => {
      htmlElement.style.setProperty("--sidebar", color);
      htmlElement.style.setProperty("--sidebar-foreground", text);
      htmlElement.style.setProperty("--primary", color);
      htmlElement.style.setProperty("--chart-1", hsl.original);
      htmlElement.style.setProperty("--chart-2", hsl.lighter);
      htmlElement.classList.remove('dark');
    });

    localStorage.setItem('color', color);
    localStorage.setItem('text', text);
    localStorage.setItem('primary', color);
    localStorage.setItem('chart1', hsl.original);
    localStorage.setItem('chart2', hsl.lighter);
    localStorage.setItem('theme', 'light');
  };

  const debouncedUpdateTheme = debounce(updateTheme, 100);

  const handleThemeChange = (color?: string) => {
    if (!color) return;
    setColor(color);
    debouncedUpdateTheme(color);
  };

  function checkIfDarkColor(hex: string | undefined) {

    if (!hex) return false;
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
  }

  function hexToHSL(hex: string): {
    original: string;
    lighter: string;
  } {
    hex = hex.replace(/^#/, '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return rgb2hsl(r, g, b);
  }

  function rgb2hsl(r: number, g: number, b: number): {
    original: string;
    lighter: string;
  } {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let lum = (max + min) / 2;
    let hue = 0;
    let sat = 0;

    if (max !== min) {
      let c = max - min;
      sat = c / (1 - Math.abs(2 * lum - 1));

      switch (max) {
        case r:
          hue = ((g - b) / c) % 6;
          break;
        case g:
          hue = (b - r) / c + 2;
          break;
        case b:
          hue = (r - g) / c + 4;
          break;
      }

      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
    }

    sat = Math.round(sat * 100);
    lum = Math.round(lum * 100);

    let lighterLum = Math.min(lum + 15, 100);

    return {
      original: `${hue} ${sat}% ${lum}%`,
      lighter: `${hue} ${sat}% ${lighterLum}%`
    };
  }

  useEffect(() => {
    const color = localStorage.getItem('color');
    const text = localStorage.getItem('text');
    const primary = localStorage.getItem('primary');
    const chart1 = localStorage.getItem('chart1');
    const chart2 = localStorage.getItem('chart2');

    if (color && text && primary) {
      setColor(color)
      document.documentElement.style.setProperty("--sidebar", color);
      document.documentElement.style.setProperty("--sidebar-foreground", text);
      document.documentElement.style.setProperty("--primary", primary);
      document.documentElement.style.setProperty("--chart-1", chart1);
      document.documentElement.style.setProperty("--chart-2", chart2);
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
                  {user.fullName && (
                    <AvatarFallback className="rounded-lg uppercase">{user.fullName ? user.fullName.split(' ')[0].slice(0, 1) + user.fullName.split(' ')[1].slice(0, 1) : ''}</AvatarFallback>
                  )}
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
                    {user.fullName && (
                      <AvatarFallback className="rounded-lg uppercase">{user.fullName ? user.fullName.split(' ')[0].slice(0, 1) + user.fullName.split(' ')[1].slice(0, 1) : ''}</AvatarFallback>
                    )}
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
          <div className="py-4 px-4">
            <div className="flex items-center justify-between">
              <p>Themes</p>
              <div className="h-6 rounded-full border border-gray-500 aspect-square overflow-hidden flex items-center justify-center">
                <input type="color" defaultValue={color} className="h-[150%] aspect-square cursor-pointer" onChange={(e) => handleThemeChange(e.target.value)} />
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
