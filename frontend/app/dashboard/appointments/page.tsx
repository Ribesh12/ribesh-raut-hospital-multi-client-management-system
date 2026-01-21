"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Inbox,
  Check,
  X,
  Mail,
  Phone,
  FileText,
  MessageSquare,
} from "lucide-react";

type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type Appointment = {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientImage: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  date: string;
  time: string;
  type: "Consultation" | "Follow-up" | "Check-up" | "Emergency";
  status: AppointmentStatus;
  notes: string;
};

type AppointmentRequest = {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  preferredDoctor: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  message: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
};

const doctors = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Dr. James Brown",
    specialty: "Orthopedics",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Dr. Lisa Anderson",
    specialty: "Pediatrics",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
  },
];

// Incoming requests from visitors (would come from API)
const initialRequests: AppointmentRequest[] = [
  {
    id: "req-1",
    patientName: "Alice Cooper",
    patientEmail: "alice.cooper@email.com",
    patientPhone: "+1 555-0301",
    preferredDoctor: "Dr. Sarah Wilson",
    preferredDate: "2024-01-25",
    preferredTime: "10:00",
    reason: "Chest pain and shortness of breath",
    message:
      "I have been experiencing occasional chest pain for the past week, especially after physical activity. I would like to get it checked by a cardiologist.",
    submittedAt: "2024-01-20T14:30:00",
    status: "pending",
  },
  {
    id: "req-2",
    patientName: "Bob Martinez",
    patientEmail: "bob.martinez@email.com",
    patientPhone: "+1 555-0302",
    preferredDoctor: "Dr. Michael Chen",
    preferredDate: "2024-01-26",
    preferredTime: "14:00",
    reason: "Recurring headaches",
    message:
      "I have been having severe headaches almost daily for the past two weeks. Over-the-counter medication doesn't seem to help.",
    submittedAt: "2024-01-20T11:15:00",
    status: "pending",
  },
  {
    id: "req-3",
    patientName: "Carol White",
    patientEmail: "carol.white@email.com",
    patientPhone: "+1 555-0303",
    preferredDoctor: "Dr. Lisa Anderson",
    preferredDate: "2024-01-24",
    preferredTime: "09:00",
    reason: "Child vaccination",
    message:
      "My 3-year-old daughter needs her scheduled vaccinations. Please let me know the available slots.",
    submittedAt: "2024-01-19T16:45:00",
    status: "pending",
  },
  {
    id: "req-4",
    patientName: "Daniel Lee",
    patientEmail: "daniel.lee@email.com",
    patientPhone: "+1 555-0304",
    preferredDoctor: "Dr. James Brown",
    preferredDate: "2024-01-27",
    preferredTime: "11:00",
    reason: "Knee injury follow-up",
    message:
      "I had knee surgery last month at another facility and would like to continue my follow-up care at your hospital.",
    submittedAt: "2024-01-18T09:20:00",
    status: "pending",
  },
];

// Confirmed appointments
const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Smith",
    patientEmail: "john.smith@email.com",
    patientPhone: "+1 555-0201",
    patientImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    doctorName: "Dr. Sarah Wilson",
    doctorImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    specialty: "Cardiology",
    date: "2024-01-21",
    time: "09:00",
    type: "Consultation",
    status: "Confirmed",
    notes: "Regular cardiac checkup. Patient has history of hypertension.",
  },
  {
    id: "2",
    patientName: "Emily Johnson",
    patientEmail: "emily.johnson@email.com",
    patientPhone: "+1 555-0202",
    patientImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    doctorName: "Dr. Michael Chen",
    doctorImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    specialty: "Neurology",
    date: "2024-01-21",
    time: "10:30",
    type: "Follow-up",
    status: "Confirmed",
    notes: "Follow-up for migraine treatment.",
  },
  {
    id: "3",
    patientName: "Robert Davis",
    patientEmail: "robert.davis@email.com",
    patientPhone: "+1 555-0203",
    patientImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    doctorName: "Dr. Sarah Wilson",
    doctorImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    specialty: "Cardiology",
    date: "2024-01-21",
    time: "11:00",
    type: "Check-up",
    status: "Completed",
    notes: "Annual heart health check completed successfully.",
  },
  {
    id: "4",
    patientName: "Maria Garcia",
    patientEmail: "maria.garcia@email.com",
    patientPhone: "+1 555-0204",
    patientImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    doctorName: "Dr. James Brown",
    doctorImage:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face",
    specialty: "Orthopedics",
    date: "2024-01-21",
    time: "14:00",
    type: "Consultation",
    status: "Confirmed",
    notes: "Initial consultation for knee pain.",
  },
  {
    id: "5",
    patientName: "Susan Brown",
    patientEmail: "susan.brown@email.com",
    patientPhone: "+1 555-0205",
    patientImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    doctorName: "Dr. Michael Chen",
    doctorImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    specialty: "Neurology",
    date: "2024-01-22",
    time: "09:30",
    type: "Check-up",
    status: "Cancelled",
    notes: "Patient cancelled due to scheduling conflict.",
  },
];

const appointmentTypes = ["Consultation", "Follow-up", "Check-up", "Emergency"];

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [requests, setRequests] =
    useState<AppointmentRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState("requests");

  // Dialog states
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<AppointmentRequest | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorId: "",
    date: "",
    time: "",
    type: "Consultation" as Appointment["type"],
    notes: "",
  });

  const [approveFormData, setApproveFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    type: "Consultation" as Appointment["type"],
    notes: "",
  });

  // Stats
  const pendingRequestsCount = requests.filter(
    (r) => r.status === "pending",
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "Confirmed",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled",
  ).length;

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  };

  const handleOpenNewDialog = () => {
    setFormData({
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      doctorId: "",
      date: "",
      time: "",
      type: "Consultation",
      notes: "",
    });
    setIsNewDialogOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleViewRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  const handleOpenApproveDialog = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    const doctor = doctors.find((d) => d.name === request.preferredDoctor);
    setApproveFormData({
      doctorId: doctor?.id || "",
      date: request.preferredDate,
      time: request.preferredTime,
      type: "Consultation",
      notes: request.reason,
    });
    setIsApproveDialogOpen(true);
  };

  const handleApproveRequest = () => {
    if (!selectedRequest) return;
    const selectedDoctor = doctors.find(
      (d) => d.id === approveFormData.doctorId,
    );
    if (!selectedDoctor) return;

    // Create new appointment from request
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: selectedRequest.patientName,
      patientEmail: selectedRequest.patientEmail,
      patientPhone: selectedRequest.patientPhone,
      patientImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      doctorName: selectedDoctor.name,
      doctorImage: selectedDoctor.image,
      specialty: selectedDoctor.specialty,
      date: approveFormData.date,
      time: approveFormData.time,
      type: approveFormData.type,
      status: "Confirmed",
      notes: approveFormData.notes,
    };

    setAppointments([...appointments, newAppointment]);
    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "approved" as const } : r,
      ),
    );
    setIsApproveDialogOpen(false);
    setIsRequestDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleRejectRequest = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "rejected" as const } : r,
      ),
    );
    setIsRequestDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleSubmitNewAppointment = () => {
    const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
    if (!selectedDoctor) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      patientPhone: formData.patientPhone,
      patientImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      doctorName: selectedDoctor.name,
      doctorImage: selectedDoctor.image,
      specialty: selectedDoctor.specialty,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: "Confirmed",
      notes: formData.notes,
    };
    setAppointments([...appointments, newAppointment]);
    setIsNewDialogOpen(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const variants: Record<
      AppointmentStatus,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
      }
    > = {
      Pending: {
        variant: "secondary",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      Confirmed: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      Completed: {
        variant: "outline",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      Cancelled: {
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    return (
      <Badge variant={variants[status].variant} className="gap-1">
        {variants[status].icon}
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: Appointment["type"]) => {
    const colors: Record<string, string> = {
      Consultation: "bg-blue-100 text-blue-800",
      "Follow-up": "bg-purple-100 text-purple-800",
      "Check-up": "bg-green-100 text-green-800",
      Emergency: "bg-red-100 text-red-800",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[type]}`}>
        {type}
      </span>
    );
  };

  // Request columns
  const requestColumns: ColumnDef<AppointmentRequest>[] = [
    {
      accessorKey: "patientName",
      header: "Patient",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div>
            <p className="font-medium">{request.patientName}</p>
            <p className="text-sm text-muted-foreground">
              {request.patientEmail}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <p className="text-sm max-w-[200px] truncate">{row.original.reason}</p>
      ),
    },
    {
      accessorKey: "preferredDoctor",
      header: "Preferred Doctor",
      cell: ({ row }) => {
        const doctor = doctors.find(
          (d) => d.name === row.original.preferredDoctor,
        );
        return (
          <div className="flex items-center gap-2">
            {doctor && (
              <Avatar className="h-7 w-7">
                <AvatarImage src={doctor.image} />
                <AvatarFallback>
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-sm">{row.original.preferredDoctor}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "preferredDate",
      header: "Preferred Date",
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {formatDate(row.original.preferredDate)}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
            <Clock className="h-3 w-3" />
            {formatTime(row.original.preferredTime)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(row.original.submittedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original;
        if (request.status !== "pending") {
          return (
            <Badge
              variant={
                request.status === "approved" ? "default" : "destructive"
              }
            >
              {request.status === "approved" ? "Approved" : "Rejected"}
            </Badge>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="gap-1"
              onClick={() => handleOpenApproveDialog(request)}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => handleRejectRequest(request.id)}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleViewRequest(request)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Appointment columns
  const appointmentColumns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "patientName",
      header: "Patient",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={appointment.patientImage} />
              <AvatarFallback>
                {appointment.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.patientName}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.patientEmail}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "doctorName",
      header: "Doctor",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={appointment.doctorImage} />
              <AvatarFallback>
                {appointment.doctorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{appointment.doctorName}</p>
              <p className="text-xs text-muted-foreground">
                {appointment.specialty}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {formatDate(row.original.date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            {formatTime(row.original.time)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => getTypeBadge(row.original.type),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <Select
            value={appointment.status}
            onValueChange={(value: AppointmentStatus) =>
              handleStatusChange(appointment.id, value)
            }
          >
            <SelectTrigger className="w-36 h-8">
              <SelectValue>{getStatusBadge(appointment.status)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Confirmed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Confirmed
                </div>
              </SelectItem>
              <SelectItem value="Completed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Completed
                </div>
              </SelectItem>
              <SelectItem value="Cancelled">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Cancelled
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleViewAppointment(appointment)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage appointment requests and scheduled appointments
          </p>
        </div>
        <Button onClick={handleOpenNewDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Inbox className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingRequestsCount}</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <CalendarCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedCount}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <CheckCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10">
              <CalendarX className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cancelledCount}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests" className="gap-2">
            <Inbox className="h-4 w-4" />
            Requests
            {pendingRequestsCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingRequestsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Appointments
            <Badge variant="secondary" className="ml-1">
              {appointments.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4">
          <DataTable
            columns={requestColumns}
            data={pendingRequests.length > 0 ? requests : requests}
            searchKey="patientName"
            searchPlaceholder="Search requests..."
          />
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <DataTable
            columns={appointmentColumns}
            data={appointments}
            searchKey="patientName"
            searchPlaceholder="Search appointments..."
          />
        </TabsContent>
      </Tabs>

      {/* New Appointment Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>
              Schedule a new appointment for a patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="John Doe"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patientPhone">Phone</Label>
                <Input
                  id="patientPhone"
                  placeholder="+1 555-0000"
                  value={formData.patientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, patientPhone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="patientEmail">Patient Email</Label>
              <Input
                id="patientEmail"
                type="email"
                placeholder="john@email.com"
                value={formData.patientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, patientEmail: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) =>
                  setFormData({ ...formData, doctorId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={doctor.image} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {doctor.name} - {doctor.specialty}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Appointment["type"]) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewAppointment}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Request</DialogTitle>
                <DialogDescription>
                  Review the appointment request details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {selectedRequest.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedRequest.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted {formatDateTime(selectedRequest.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRequest.patientEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRequest.patientPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Stethoscope className="h-4 w-4" />
                      Preferred Doctor
                    </p>
                    <p className="font-medium">
                      {selectedRequest.preferredDoctor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        Preferred Date
                      </p>
                      <p className="font-medium">
                        {formatDate(selectedRequest.preferredDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4" />
                        Preferred Time
                      </p>
                      <p className="font-medium">
                        {formatTime(selectedRequest.preferredTime)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4" />
                      Reason
                    </p>
                    <p className="font-medium">{selectedRequest.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </p>
                    <p className="text-sm bg-secondary p-3 rounded-lg">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleOpenApproveDialog(selectedRequest)}
                    >
                      <Check className="h-4 w-4" />
                      Approve & Schedule
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve & Schedule Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Approve & Schedule Appointment</DialogTitle>
                <DialogDescription>
                  Confirm the appointment details for{" "}
                  {selectedRequest.patientName}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="approveDoctor">Assign Doctor</Label>
                  <Select
                    value={approveFormData.doctorId}
                    onValueChange={(value) =>
                      setApproveFormData({
                        ...approveFormData,
                        doctorId: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={doctor.image} />
                              <AvatarFallback>
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {doctor.name} - {doctor.specialty}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="approveDate">Date</Label>
                    <Input
                      id="approveDate"
                      type="date"
                      value={approveFormData.date}
                      onChange={(e) =>
                        setApproveFormData({
                          ...approveFormData,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="approveTime">Time</Label>
                    <Input
                      id="approveTime"
                      type="time"
                      value={approveFormData.time}
                      onChange={(e) =>
                        setApproveFormData({
                          ...approveFormData,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="approveType">Appointment Type</Label>
                  <Select
                    value={approveFormData.type}
                    onValueChange={(value: Appointment["type"]) =>
                      setApproveFormData({ ...approveFormData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="approveNotes">Notes</Label>
                  <Textarea
                    id="approveNotes"
                    placeholder="Additional notes..."
                    value={approveFormData.notes}
                    onChange={(e) =>
                      setApproveFormData({
                        ...approveFormData,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleApproveRequest}>
                  Confirm Appointment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedAppointment.patientImage} />
                      <AvatarFallback>
                        {selectedAppointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedAppointment.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.patientEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.patientPhone}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(selectedAppointment.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Doctor
                    </p>
                    <p className="font-medium">
                      {selectedAppointment.doctorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.specialty}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date & Time
                    </p>
                    <p className="font-medium">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(selectedAppointment.time)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  {getTypeBadge(selectedAppointment.type)}
                </div>

                {selectedAppointment.notes && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm bg-secondary p-3 rounded-lg">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
