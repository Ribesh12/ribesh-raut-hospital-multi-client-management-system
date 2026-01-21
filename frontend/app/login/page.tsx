"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoFull } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Lock,
  ArrowRight,
  Building2,
  Users,
  Calendar,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-block mb-8">
            <LogoFull />
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to access your hospital dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@hospital.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <Separator className="my-8" />

          <p className="text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold">
              Register your hospital
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Info */}
      <div className="hidden lg:flex flex-1 bg-primary p-12 flex-col justify-between text-white">
        <div>
          <h2 className="text-2xl font-bold mb-2">MediCare Hub</h2>
          <p className="text-white/70">Hospital Management System</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-4xl font-bold mb-4">
              Manage your hospital
              <br />
              with confidence
            </h3>
            <p className="text-white/80 text-lg max-w-md">
              Join 500+ healthcare facilities using MediCare Hub to streamline
              operations and improve patient care.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4">
              <Building2 className="h-8 w-8 mb-3" />
              <p className="text-2xl font-bold">500+</p>
              <p className="text-white/70 text-sm">Hospitals</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <Users className="h-8 w-8 mb-3" />
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-white/70 text-sm">Doctors</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <Calendar className="h-8 w-8 mb-3" />
              <p className="text-2xl font-bold">1M+</p>
              <p className="text-white/70 text-sm">Appointments</p>
            </div>
          </div>
        </div>

        <p className="text-white/50 text-sm">
          © 2026 MediCare Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
