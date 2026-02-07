"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoFull } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Stethoscope,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Users,
  Activity,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tokenManager } from "@/lib/api";

const sidebarLinks = [
  {
    href: "/super-admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/super-admin/hospitals",
    label: "Hospitals",
    icon: Building2,
  },
  {
    href: "/super-admin/doctors",
    label: "All Doctors",
    icon: Stethoscope,
  },
  {
    href: "/super-admin/appointments",
    label: "All Appointments",
    icon: Calendar,
  },
  {
    href: "/super-admin/patients",
    label: "All Patients",
    icon: Users,
  },
  {
    href: "/super-admin/messages",
    label: "All Messages",
    icon: MessageSquare,
  },
];

const bottomLinks = [
  {
    href: "/super-admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

interface UserInfo {
  id: string;
  userType: string;
  username?: string;
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and user info
    const checkAuth = () => {
      const token = tokenManager.getToken();
      const user = localStorage.getItem("userInfo");

      if (!token || !user) {
        router.push("/login");
        return;
      }

      try {
        const userData: UserInfo = JSON.parse(user);
        
        // Check if user is a super admin (website_admin)
        if (userData.userType !== "website_admin") {
          // Redirect hospital admins to their dashboard
          router.push("/dashboard");
          return;
        }

        setUserInfo(userData);
      } catch (error) {
        console.error("Error parsing user info:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    tokenManager.removeToken();
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  const displayName = userInfo?.username || "Super Admin";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-700">
          <Link href="/super-admin" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-amber-500" />
            <div>
              <span className="font-bold text-lg">HMT</span>
              <span className="text-xs block text-amber-500">Super Admin</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/super-admin" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500 text-slate-900"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Separator className="my-4 bg-slate-700" />

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Settings
          </p>
          <ul className="space-y-1">
            {bottomLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500 text-slate-900"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 bg-amber-500 text-slate-900">
              <AvatarImage src="" />
              <AvatarFallback className="bg-amber-500 text-slate-900 font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">Super Admin</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  {sidebarLinks.find(
                    (l) =>
                      l.href === pathname ||
                      (l.href !== "/super-admin" && pathname.startsWith(l.href))
                  )?.label ||
                    bottomLinks.find((l) => l.href === pathname)?.label ||
                    "Super Admin Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Platform Administration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8 bg-amber-500 text-slate-900">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-amber-500 text-slate-900 font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{displayName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/super-admin/settings" className="flex w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
