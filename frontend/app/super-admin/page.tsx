"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Calendar,
  Users,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Activity,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { superAdminAPI } from "@/lib/api";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await superAdminAPI.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching super admin stats:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
    trend,
    subtitle,
  }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    bgColor: string;
    trend?: { value: number; direction: "up" | "down" };
    subtitle?: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs mt-2 ${
                  trend.direction === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend.value)}% this month
              </div>
            )}
          </div>
          <div className={`${bgColor} p-3 rounded-xl`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getAppointmentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardContent className="flex items-center gap-4 pt-6">
          <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">
              Error Loading Dashboard
            </p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statistics = stats?.statistics || {};

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, Super Admin</h1>
            <p className="text-slate-300">
              Here's an overview of your entire healthcare platform.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-amber-400">Platform Active</p>
            </div>
            <Activity className="h-12 w-12 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hospitals"
          value={statistics.hospitals?.total || 0}
          icon={Building2}
          color="text-blue-600"
          bgColor="bg-blue-100"
          trend={
            statistics.hospitals?.growth !== undefined
              ? {
                  value: Math.abs(statistics.hospitals.growth),
                  direction: statistics.hospitals.growth >= 0 ? "up" : "down",
                }
              : undefined
          }
          subtitle={`${statistics.hospitals?.withProfile || 0} with complete profile`}
        />
        <StatCard
          title="Total Doctors"
          value={statistics.doctors?.total || 0}
          icon={Stethoscope}
          color="text-green-600"
          bgColor="bg-green-100"
          trend={
            statistics.doctors?.growth !== undefined
              ? {
                  value: Math.abs(statistics.doctors.growth),
                  direction: statistics.doctors.growth >= 0 ? "up" : "down",
                }
              : undefined
          }
          subtitle={`${statistics.doctors?.thisMonth || 0} added this month`}
        />
        <StatCard
          title="Total Appointments"
          value={statistics.appointments?.total || 0}
          icon={Calendar}
          color="text-purple-600"
          bgColor="bg-purple-100"
          subtitle={`${statistics.appointments?.today || 0} today`}
        />
        <StatCard
          title="Total Patients"
          value={statistics.patients?.total || 0}
          icon={Users}
          color="text-amber-600"
          bgColor="bg-amber-100"
          subtitle="Unique patients"
        />
      </div>

      {/* Appointment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {statistics.appointments?.pending || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">
                  {statistics.appointments?.confirmed || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {statistics.appointments?.completed || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">
                  {statistics.appointments?.cancelled || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hospitals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Hospitals</CardTitle>
              <CardDescription>
                Newest hospitals registered on the platform
              </CardDescription>
            </div>
            <Link href="/super-admin/hospitals">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentHospitals?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentHospitals.map((hospital: any) => (
                  <div
                    key={hospital._id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{hospital.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {hospital.email}
                      </p>
                    </div>
                    <Badge
                      variant={hospital.isProfileComplete ? "default" : "secondary"}
                      className={
                        hospital.isProfileComplete
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {hospital.isProfileComplete ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hospitals registered yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Hospitals by Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Top Hospitals</CardTitle>
              <CardDescription>
                Hospitals with most appointments
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.topHospitals?.length > 0 ? (
              <div className="space-y-4">
                {stats.topHospitals.map((item: any, index: number) => (
                  <div
                    key={item.hospitalId}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? "bg-amber-500"
                          : index === 1
                          ? "bg-slate-400"
                          : index === 2
                          ? "bg-amber-700"
                          : "bg-slate-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.hospitalName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.hospitalEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.appointmentCount}</p>
                      <p className="text-xs text-muted-foreground">appointments</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No appointment data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
            <CardDescription>
              Latest appointments across all hospitals
            </CardDescription>
          </div>
          <Link href="/super-admin/appointments">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats?.recentAppointments?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Patient
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Hospital
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((apt: any) => (
                    <tr key={apt._id} className="border-b hover:bg-secondary/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {apt.patientName
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{apt.patientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {apt.patientEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-medium text-sm">{apt.doctorName || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.doctorSpecialty || ""}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm">{apt.hospitalName || "N/A"}</p>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          className={getAppointmentStatusColor(apt.status)}
                          variant="secondary"
                        >
                          {apt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No appointments yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {statistics.contactForms?.total || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-xs text-amber-600">
                  {statistics.contactForms?.unread || 0} unread
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {statistics.appointments?.thisWeek || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Appointments This Week
                </p>
                <p className="text-xs text-green-600">
                  {statistics.appointments?.today || 0} today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {statistics.services?.total || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Services</p>
                <p className="text-xs text-blue-600">Across all hospitals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
