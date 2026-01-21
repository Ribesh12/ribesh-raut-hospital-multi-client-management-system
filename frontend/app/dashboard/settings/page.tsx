"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [hospitalData, setHospitalData] = useState({
    name: "City General Hospital",
    email: "contact@citygeneral.com",
    phone: "+1 555-0100",
    address: "123 Medical Center Drive, New York, NY 10001",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: just show alert
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">Manage your hospital settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Information</CardTitle>
            <CardDescription>Update your hospital details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hospital Name</Label>
                <Input
                  id="name"
                  value={hospitalData.name}
                  onChange={(e) =>
                    setHospitalData({ ...hospitalData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={hospitalData.email}
                  onChange={(e) =>
                    setHospitalData({ ...hospitalData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={hospitalData.phone}
                  onChange={(e) =>
                    setHospitalData({ ...hospitalData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={hospitalData.address}
                  onChange={(e) =>
                    setHospitalData({
                      ...hospitalData,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium text-red-800">
                  Delete Hospital Account
                </h4>
                <p className="text-sm text-red-600">
                  Once deleted, all data will be permanently removed.
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
