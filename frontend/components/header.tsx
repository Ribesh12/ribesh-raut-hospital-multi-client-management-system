"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoFull } from "@/components/logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Phone,
  Mail,
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  FileText,
  Shield,
  Crown,
  Gem,
  Award,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

const features = [
  {
    title: "Appointment Scheduling",
    description: "Smart booking with automated reminders",
    icon: Calendar,
    href: "/#features",
  },
  {
    title: "Doctor Management",
    description: "Complete physician profiles & scheduling",
    icon: Users,
    href: "/#features",
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time insights and reporting",
    icon: BarChart3,
    href: "/#features",
  },
  {
    title: "AI Chatbot",
    description: "24/7 patient support automation",
    icon: MessageSquare,
    href: "/#features",
  },
  {
    title: "Digital Records",
    description: "Secure cloud-based patient records",
    icon: FileText,
    href: "/#features",
  },
  {
    title: "HIPAA Compliant",
    description: "Enterprise-grade security",
    icon: Shield,
    href: "/#features",
  },
];

const pricingTiers = [
  {
    name: "Gold",
    price: "$99/mo",
    description: "Perfect for small clinics",
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    features: ["Up to 5 doctors", "500 appointments/mo", "Basic analytics"],
    href: "/#pricing",
  },
  {
    name: "Platinum",
    price: "$299/mo",
    description: "For growing hospitals",
    icon: Gem,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    features: ["Up to 25 doctors", "Unlimited appointments", "AI chatbot"],
    href: "/#pricing",
    popular: true,
  },
  {
    name: "Diamond",
    price: "Custom",
    description: "Enterprise solution",
    icon: Crown,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    features: ["Unlimited doctors", "Multi-location", "24/7 support"],
    href: "/#pricing",
  },
];

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function Header() {
  return (
    <header className="bg-white">
      {/* Top bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 000-0000</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@medicarehub.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Sparkles className="h-4 w-4" />
            <span>24/7 Emergency Support</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <LogoFull />
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Features Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-2 p-4 md:grid-cols-2">
                    {features.map((feature) => (
                      <ListItem
                        key={feature.title}
                        title={feature.title}
                        href={feature.href}
                        icon={feature.icon}
                      >
                        {feature.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {pricingTiers.map((tier) => (
                        <Link
                          key={tier.name}
                          href={tier.href}
                          className={cn(
                            "block rounded-lg p-4 transition-colors hover:bg-accent relative",
                            tier.popular && "ring-2 ring-primary",
                          )}
                        >
                          {tier.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                              tier.bgColor,
                            )}
                          >
                            <tier.icon className={cn("h-5 w-5", tier.color)} />
                          </div>
                          <h3 className="font-semibold">{tier.name}</h3>
                          <p className="text-lg font-bold text-primary">
                            {tier.price}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {tier.description}
                          </p>
                          <ul className="space-y-1">
                            {tier.features.map((f) => (
                              <li
                                key={f}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        All plans include a 14-day free trial
                      </p>
                      <Link href="/#pricing">
                        <Button variant="outline" size="sm">
                          Compare Plans
                        </Button>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Regular Links */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/#testimonials">Testimonials</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/#faq">FAQ</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/#contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
