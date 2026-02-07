"use client";

import Link from "next/link";
import { useState } from "react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      {/* Top bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">+1 (555) 000-0000</span>
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
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/">
            <LogoFull />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
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
                  <Link href="/hospitals">Hospitals</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

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

          {/* Auth buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>
                    <LogoFull />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="features" className="border-b-0">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 pl-4">
                          {features.map((feature) => (
                            <Link
                              key={feature.title}
                              href={feature.href}
                              className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <feature.icon className="h-4 w-4" />
                              {feature.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="pricing" className="border-b-0">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        Pricing
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-3 pl-4">
                          {pricingTiers.map((tier) => (
                            <Link
                              key={tier.name}
                              href={tier.href}
                              className="flex items-center gap-3 py-2"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", tier.bgColor)}>
                                <tier.icon className={cn("h-4 w-4", tier.color)} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{tier.name}</p>
                                <p className="text-xs text-muted-foreground">{tier.price}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Link
                    href="/hospitals"
                    className="py-2 font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hospitals
                  </Link>
                  <Link
                    href="/#testimonials"
                    className="py-2 font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/#faq"
                    className="py-2 font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/#contact"
                    className="py-2 font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>

                  <Separator className="my-2" />

                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
