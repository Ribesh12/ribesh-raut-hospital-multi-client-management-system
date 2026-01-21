"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";

type Schedule = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  days: string[];
  startTime: string;
  endTime: string;
  maxPatients: number;
  status: "Active" | "Inactive";
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

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialSchedules: Schedule[] = [
  {
    id: "1",
    doctorId: "1",
    doctorName: "Dr. Sarah Wilson",
    doctorImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    specialty: "Cardiology",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "09:00",
    endTime: "17:00",
    maxPatients: 20,
    status: "Active",
  },
  {
    id: "2",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    doctorImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    specialty: "Neurology",
    days: ["Monday", "Wednesday", "Friday"],
    startTime: "10:00",
    endTime: "18:00",
    maxPatients: 15,
    status: "Active",
  },
  {
    id: "3",
    doctorId: "3",
    doctorName: "Dr. James Brown",
    doctorImage:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face",
    specialty: "Orthopedics",
    days: ["Tuesday", "Thursday", "Saturday"],
    startTime: "08:00",
    endTime: "14:00",
    maxPatients: 12,
    status: "Inactive",
  },
  {
    id: "4",
    doctorId: "4",
    doctorName: "Dr. Lisa Anderson",
    doctorImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
    specialty: "Pediatrics",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    startTime: "09:00",
    endTime: "15:00",
    maxPatients: 25,
    status: "Active",
  },
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(
    null,
  );

  const [formData, setFormData] = useState({
    doctorId: "",
    days: [] as string[],
    startTime: "",
    endTime: "",
    maxPatients: "",
    status: "Active" as Schedule["status"],
  });

  const handleOpenDialog = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        doctorId: schedule.doctorId,
        days: schedule.days,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        maxPatients: schedule.maxPatients.toString(),
        status: schedule.status,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        doctorId: "",
        days: [],
        startTime: "",
        endTime: "",
        maxPatients: "",
        status: "Active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
    if (!selectedDoctor) return;

    if (editingSchedule) {
      setSchedules(
        schedules.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                ...formData,
                doctorName: selectedDoctor.name,
                doctorImage: selectedDoctor.image,
                specialty: selectedDoctor.specialty,
                maxPatients: parseInt(formData.maxPatients),
              }
            : s,
        ),
      );
    } else {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        ...formData,
        doctorName: selectedDoctor.name,
        doctorImage: selectedDoctor.image,
        specialty: selectedDoctor.specialty,
        maxPatients: parseInt(formData.maxPatients),
      };
      setSchedules([...schedules, newSchedule]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingSchedule) {
      setSchedules(schedules.filter((s) => s.id !== deletingSchedule.id));
      setIsDeleteDialogOpen(false);
      setDeletingSchedule(null);
    }
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const getStatusBadge = (status: Schedule["status"]) => {
    return (
      <Badge variant={status === "Active" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: "doctorName",
      header: "Doctor",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={schedule.doctorImage} />
              <AvatarFallback>
                {schedule.doctorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{schedule.doctorName}</p>
              <p className="text-sm text-muted-foreground">
                {schedule.specialty}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "days",
      header: "Working Days",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.days.map((day) => (
            <Badge key={day} variant="outline" className="text-xs">
              {day.slice(0, 3)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Hours",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {formatTime(row.original.startTime)} -{" "}
          {formatTime(row.original.endTime)}
        </div>
      ),
    },
    {
      accessorKey: "maxPatients",
      header: "Max Patients",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.maxPatients} per day
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const schedule = row.original;
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
              <DropdownMenuItem onClick={() => handleOpenDialog(schedule)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setDeletingSchedule(schedule);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage doctor schedules and availability
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={schedules}
        searchKey="doctorName"
        searchPlaceholder="Search by doctor name..."
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
            </DialogTitle>
            <DialogDescription>
              {editingSchedule
                ? "Update the schedule details below."
                : "Set up a new schedule for a doctor."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <div className="grid gap-2">
              <Label>Working Days</Label>
              <div className="grid grid-cols-4 gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.days.includes(day)}
                      onCheckedChange={() => toggleDay(day)}
                    />
                    <Label htmlFor={day} className="text-sm font-normal">
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxPatients">Max Patients per Day</Label>
                <Input
                  id="maxPatients"
                  type="number"
                  placeholder="20"
                  value={formData.maxPatients}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPatients: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Schedule["status"]) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingSchedule ? "Save Changes" : "Add Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the schedule for{" "}
              {deletingSchedule?.doctorName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
