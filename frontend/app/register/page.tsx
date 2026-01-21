"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoFull } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  ArrowRight,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreed) {
      setError("Please agree to the terms and conditions");
      return;
    }

    router.push("/dashboard");
  };

  const benefits = [
    "14-day free trial included",
    "No credit card required",
    "Full access to all features",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Info */}
      <div className="hidden lg:flex flex-1 bg-primary p-12 flex-col justify-between text-white">
        <div>
          <Link href="/">
            <LogoFull variant="white" />
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-4xl font-bold mb-4">
              Start managing your
              <br />
              hospital today
            </h3>
            <p className="text-white/80 text-lg max-w-md">
              Create your account in minutes and transform how you manage
              appointments, doctors, and patients.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm">
          © 2026 MediCare Hub. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-8">
            <Link href="/">
              <LogoFull />
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Register your hospital to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Hospital Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="City General Hospital"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@hospital.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Medical Center Drive, City"
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked: boolean) => setAgreed(checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-tight"
              >
                I agree to the{" "}
                <Link href="#" className="text-primary font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <Separator className="my-6" />

          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
