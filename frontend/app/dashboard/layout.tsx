"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoFull } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  MessageSquare,
  Settings,
  LogOut,
  Clock,
  Briefcase,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    href: "/dashboard/services",
    label: "Services",
    icon: Briefcase,
  },
  {
    href: "/dashboard/schedules",
    label: "Schedules",
    icon: Clock,
  },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    href: "/dashboard/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
  },
];

const bottomLinks = [
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full">
        <div className="p-4 border-b border-border">
          <Link href="/dashboard">
            <LogoFull />
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Separator className="my-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">City General</p>
              <p className="text-xs text-muted-foreground truncate">
                admin@citygeneral.com
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
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
            <div>
              <h1 className="text-xl font-semibold">
                {sidebarLinks.find(
                  (l) =>
                    l.href === pathname ||
                    (l.href !== "/dashboard" && pathname.startsWith(l.href)),
                )?.label ||
                  bottomLinks.find((l) => l.href === pathname)?.label ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" />
                      <AvatarFallback>CG</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">City General</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings" className="flex w-full">
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
