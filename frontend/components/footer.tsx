import Link from "next/link";
import { LogoFull } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-white/80">
                Get the latest updates on healthcare management
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-foreground border-0 w-full md:w-80"
              />
              <Button variant="secondary">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <LogoFull variant="white" />
              </div>
              <p className="text-white/70 mb-6 max-w-sm">
                MediCare Hub is a comprehensive multi-tenant hospital management
                system designed to streamline healthcare operations for modern
                medical facilities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>123 Healthcare Avenue, Medical District, NY 10001</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+1 (555) 000-0000</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>support@medicarehub.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-white/70">
                <li>
                  <Link href="/#features" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#testimonials"
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" /> Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Our Services</h4>
              <ul className="space-y-3 text-white/70">
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Appointment Booking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Doctor Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Patient Records
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> AI Chatbot
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-white/70">
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-10 bg-white/20" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/60 text-sm">
              © 2026 MediCare Hub. All rights reserved. Designed for modern
              healthcare.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
