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
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  experience: number;
  status: "Active" | "On Leave" | "Inactive";
  image: string;
  joinDate: string;
};

const initialDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    email: "sarah.wilson@hospital.com",
    phone: "+1 555-0101",
    experience: 12,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    joinDate: "2020-01-15",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    email: "michael.chen@hospital.com",
    phone: "+1 555-0102",
    experience: 15,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    joinDate: "2019-03-22",
  },
  {
    id: "3",
    name: "Dr. James Brown",
    specialty: "Orthopedics",
    email: "james.brown@hospital.com",
    phone: "+1 555-0103",
    experience: 10,
    status: "On Leave",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face",
    joinDate: "2021-06-10",
  },
  {
    id: "4",
    name: "Dr. Lisa Anderson",
    specialty: "Pediatrics",
    email: "lisa.anderson@hospital.com",
    phone: "+1 555-0104",
    experience: 8,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
    joinDate: "2022-02-28",
  },
  {
    id: "5",
    name: "Dr. Robert Martinez",
    specialty: "Dermatology",
    email: "robert.martinez@hospital.com",
    phone: "+1 555-0105",
    experience: 6,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop&crop=face",
    joinDate: "2023-01-05",
  },
  {
    id: "6",
    name: "Dr. Jennifer Taylor",
    specialty: "Psychiatry",
    email: "jennifer.taylor@hospital.com",
    phone: "+1 555-0106",
    experience: 9,
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face",
    joinDate: "2020-09-14",
  },
];

const specialties = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Psychiatry",
  "Oncology",
  "Ophthalmology",
  "ENT",
  "General Medicine",
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    experience: "",
    status: "Active" as Doctor["status"],
  });

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialty: doctor.specialty,
        email: doctor.email,
        phone: doctor.phone,
        experience: doctor.experience.toString(),
        status: doctor.status,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "",
        specialty: "",
        email: "",
        phone: "",
        experience: "",
        status: "Active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingDoctor) {
      setDoctors(
        doctors.map((d) =>
          d.id === editingDoctor.id
            ? {
                ...d,
                ...formData,
                experience: parseInt(formData.experience),
              }
            : d,
        ),
      );
    } else {
      const newDoctor: Doctor = {
        id: Date.now().toString(),
        ...formData,
        experience: parseInt(formData.experience),
        image: `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face`,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setDoctors([...doctors, newDoctor]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingDoctor) {
      setDoctors(doctors.filter((d) => d.id !== deletingDoctor.id));
      setIsDeleteDialogOpen(false);
      setDeletingDoctor(null);
    }
  };

  const getStatusBadge = (status: Doctor["status"]) => {
    const variants: Record<
      Doctor["status"],
      "default" | "secondary" | "destructive"
    > = {
      Active: "default",
      "On Leave": "secondary",
      Inactive: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const columns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "name",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={doctor.image} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{doctor.name}</p>
              <p className="text-sm text-muted-foreground">
                {doctor.specialty}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              {doctor.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {doctor.phone}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.experience} years
        </span>
      ),
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(row.original.joinDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
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
        const doctor = row.original;
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
              <DropdownMenuItem onClick={() => handleOpenDialog(doctor)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setDeletingDoctor(doctor);
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
            Manage your hospital&apos;s medical staff
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={doctors}
        searchKey="name"
        searchPlaceholder="Search doctors..."
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
            <DialogDescription>
              {editingDoctor
                ? "Update the doctor's information below."
                : "Fill in the details to add a new doctor."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) =>
                  setFormData({ ...formData, specialty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 555-0100"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="10"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Doctor["status"]) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
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
              {editingDoctor ? "Save Changes" : "Add Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingDoctor?.name}? This
              action cannot be undone.
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
