"use client";

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
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Doctors",
    value: "24",
    change: "+2",
    trend: "up",
    icon: Stethoscope,
    color: "bg-blue-500",
  },
  {
    title: "Today's Appointments",
    value: "18",
    change: "+5",
    trend: "up",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    title: "Total Patients",
    value: "1,248",
    change: "+48",
    trend: "up",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    title: "Avg. Wait Time",
    value: "12 min",
    change: "-3",
    trend: "down",
    icon: Clock,
    color: "bg-orange-500",
  },
];

const recentAppointments = [
  {
    id: 1,
    patient: "John Smith",
    patientImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    doctor: "Dr. Sarah Wilson",
    time: "09:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Emily Johnson",
    patientImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    doctor: "Dr. Michael Chen",
    time: "10:30 AM",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Robert Davis",
    patientImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    doctor: "Dr. Sarah Wilson",
    time: "11:00 AM",
    status: "Confirmed",
  },
  {
    id: 4,
    patient: "Maria Garcia",
    patientImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    doctor: "Dr. James Brown",
    time: "02:00 PM",
    status: "In Progress",
  },
  {
    id: 5,
    patient: "David Miller",
    patientImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    doctor: "Dr. Lisa Anderson",
    time: "03:30 PM",
    status: "Pending",
  },
];

const topDoctors = [
  {
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    patients: 156,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    patients: 142,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Dr. James Brown",
    specialty: "Orthopedics",
    patients: 128,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Dr. Lisa Anderson",
    specialty: "Pediatrics",
    patients: 115,
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
  },
];

// Chart configurations
const patientsChartOptions = {
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
};

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

const appointmentsChartOptions = {
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
};

const appointmentsSeries = [
  {
    name: "Appointments",
    data: [12, 25, 48, 5],
  },
];

const departmentChartOptions = {
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
};

const departmentSeries = [28, 22, 18, 17, 15];

export default function DashboardPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at City General
            Hospital today.
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
                options={patientsChartOptions}
                series={patientsSeries}
                type="area"
                height="100%"
              />
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
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
              options={appointmentsChartOptions}
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
            <CardTitle>Recent Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/appointments">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Top Doctors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Doctors</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/doctors">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
