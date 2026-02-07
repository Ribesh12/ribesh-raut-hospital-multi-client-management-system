"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chart } from "@/components/ui/chart";
import {
  Stethoscope,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { doctorAPI, appointmentAPI } from "@/lib/api";

const chartDefaults = {
  patientsChartOptions: {
    chart: {
      id: "patients-chart",
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: "inherit",
    },
    colors: ["#0573EC", "#10b981"],
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "right" as const,
    },
    tooltip: {
      theme: "light",
    },
  },

  appointmentsChartOptions: {
    chart: {
      id: "appointments-chart",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#0573EC", "#f59e0b", "#10b981", "#ef4444"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "60%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Pending", "Confirmed", "Completed", "Cancelled"],
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
    },
  },

  departmentChartOptions: {
    chart: {
      id: "department-chart",
      fontFamily: "inherit",
    },
    colors: ["#0573EC", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"],
    labels: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Other"],
    legend: {
      position: "bottom" as const,
      fontSize: "13px",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
            },
          },
        },
      },
    },
    tooltip: {
      theme: "light",
    },
  },
};

export default function DashboardPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userStr = localStorage.getItem("userInfo");
      if (!userStr) {
        setError("User information not found. Please log in again.");
        return;
      }

      const user = JSON.parse(userStr);
      const hospitalId = user?.hospitalId || user?._id;

      if (!hospitalId) {
        setError("Hospital ID not found. Please log in again.");
        return;
      }

      // Fetch doctors
      const doctorsRes = await doctorAPI.getByHospital(hospitalId);
      const doctorsData = doctorsRes.data || [];
      setDoctors(doctorsData);

      // Fetch appointments
      const appointmentsRes = await appointmentAPI.getByHospital(hospitalId);
      const appointmentsData = appointmentsRes.data || [];
      setAppointments(appointmentsData);

      // Calculate stats from fetched data
      const totalDoctors = doctorsData.length;
      const totalAppointments = appointmentsData.length;
      const todayAppointments = appointmentsData.filter((apt: any) => {
        const aptDate = new Date(apt.appointmentDate).toDateString();
        const today = new Date().toDateString();
        return aptDate === today;
      }).length;

      const confirmedAppointments = appointmentsData.filter(
        (apt: any) => apt.status === "Confirmed"
      ).length;
      const pendingAppointments = appointmentsData.filter(
        (apt: any) => apt.status === "Pending"
      ).length;

      setStats([
        {
          title: "Total Doctors",
          value: totalDoctors.toString(),
          change: "+2",
          trend: "up",
          icon: Stethoscope,
          color: "bg-blue-500",
        },
        {
          title: "Today's Appointments",
          value: todayAppointments.toString(),
          change: "+5",
          trend: "up",
          icon: Calendar,
          color: "bg-green-500",
        },
        {
          title: "Total Appointments",
          value: totalAppointments.toString(),
          change: `+${confirmedAppointments}`,
          trend: "up",
          icon: Users,
          color: "bg-purple-500",
        },
        {
          title: "Pending",
          value: pendingAppointments.toString(),
          change: "-3",
          trend: "down",
          icon: Clock,
          color: "bg-orange-500",
        },
      ]);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err.message || "Failed to load dashboard data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      Confirmed: "default",
      Pending: "secondary",
      "In Progress": "outline",
      Cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="text-xs">
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
            <Button size="sm" onClick={fetchDashboardData}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const patientsSeries = [
    {
      name: "New Patients",
      data: [28, 35, 42, 38, 45, 32, 40],
    },
    {
      name: "Returning Patients",
      data: [45, 52, 48, 55, 62, 48, 58],
    },
  ];

  const appointmentCounts = {
    pending: appointments.filter((apt) => apt.status === "Pending").length,
    confirmed: appointments.filter((apt) => apt.status === "Confirmed").length,
    completed: appointments.filter((apt) => apt.status === "Completed").length,
    cancelled: appointments.filter((apt) => apt.status === "Cancelled").length,
  };

  const appointmentsSeries = [
    {
      name: "Appointments",
      data: [
        appointmentCounts.pending,
        appointmentCounts.confirmed,
        appointmentCounts.completed,
        appointmentCounts.cancelled,
      ],
    },
  ];

  // Calculate specialty distribution
  const specialtyMap: Record<string, number> = {};
  doctors.forEach((doctor) => {
    const specialty = doctor.specialty || "Other";
    specialtyMap[specialty] = (specialtyMap[specialty] || 0) + 1;
  });

  const topSpecialties = Object.entries(specialtyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const departmentLabels = topSpecialties.map((s) => s[0]);
  const departmentSeries = topSpecialties.map((s) => s[1]);

  const departmentChartOptions = {
    ...chartDefaults.departmentChartOptions,
    labels: departmentLabels,
  };

  const recentAppointments = appointments
    .slice(0, 5)
    .map((apt) => ({
      id: apt._id,
      patient: apt.patientName,
      patientImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      doctor: apt.doctorName || "Dr. Not Assigned",
      time: apt.appointmentTime
        ? new Date(`2000-01-01T${apt.appointmentTime}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      status: apt.status,
    }));

  const topDoctors = doctors
    .sort((a, b) => (b.appointmentCount || 0) - (a.appointmentCount || 0))
    .slice(0, 4)
    .map((doctor, index) => ({
      name: doctor.name,
      specialty: doctor.specialty,
      patients: doctor.appointmentCount || Math.floor(Math.random() * 100) + 50,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your hospital&apos;s dashboard for today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/appointments">
            <Calendar className="w-4 h-4 mr-2" />
            New Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm text-green-500 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      vs last week
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Visits This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Chart
                options={chartDefaults.patientsChartOptions}
                series={patientsSeries}
                type="area"
                height="100%"
              />
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        {departmentLabels.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Specialties Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Chart
                  options={departmentChartOptions}
                  series={departmentSeries}
                  type="donut"
                  height="100%"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Appointments Status Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Appointments Overview</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/appointments">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <Chart
              options={chartDefaults.appointmentsChartOptions}
              series={appointmentsSeries}
              type="bar"
              height="100%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Appointments & Top Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Recent Appointments ({recentAppointments.length})
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/appointments">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={appointment.patientImage} />
                        <AvatarFallback>
                          {appointment.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">{appointment.time}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                No appointments yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Doctors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Doctors ({doctors.length})</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/doctors">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {topDoctors.length > 0 ? (
              <div className="space-y-4">
                {topDoctors.map((doctor, index) => (
                  <div
                    key={doctor.name}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={doctor.image} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{doctor.patients}</p>
                      <p className="text-xs text-muted-foreground">patients</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                No doctors yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
