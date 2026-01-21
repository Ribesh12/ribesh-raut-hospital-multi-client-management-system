"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Separator } from "@/components/ui/separator";
import {
  MoreHorizontal,
  Eye,
  FileDown,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  lastVisit: string;
  totalVisits: number;
  status: "Active" | "Inactive";
  image: string;
};

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-1001",
    dob: "1985-03-15",
    gender: "Male",
    bloodGroup: "A+",
    address: "123 Main Street, New York, NY 10001",
    emergencyContact: "+1 555-9001",
    lastVisit: "2024-01-15",
    totalVisits: 12,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1 555-1002",
    dob: "1990-07-22",
    gender: "Female",
    bloodGroup: "B+",
    address: "456 Oak Avenue, Los Angeles, CA 90001",
    emergencyContact: "+1 555-9002",
    lastVisit: "2024-01-18",
    totalVisits: 8,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Robert Davis",
    email: "robert.davis@email.com",
    phone: "+1 555-1003",
    dob: "1978-11-08",
    gender: "Male",
    bloodGroup: "O+",
    address: "789 Pine Road, Chicago, IL 60601",
    emergencyContact: "+1 555-9003",
    lastVisit: "2024-01-20",
    totalVisits: 15,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 555-1004",
    dob: "1995-02-28",
    gender: "Female",
    bloodGroup: "AB+",
    address: "321 Cedar Lane, Houston, TX 77001",
    emergencyContact: "+1 555-9004",
    lastVisit: "2024-01-19",
    totalVisits: 5,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "David Miller",
    email: "david.miller@email.com",
    phone: "+1 555-1005",
    dob: "1982-09-12",
    gender: "Male",
    bloodGroup: "A-",
    address: "654 Maple Street, Phoenix, AZ 85001",
    emergencyContact: "+1 555-9005",
    lastVisit: "2024-01-17",
    totalVisits: 20,
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Susan Brown",
    email: "susan.brown@email.com",
    phone: "+1 555-1006",
    dob: "1988-05-30",
    gender: "Female",
    bloodGroup: "B-",
    address: "987 Elm Court, Philadelphia, PA 19101",
    emergencyContact: "+1 555-9006",
    lastVisit: "2024-01-14",
    totalVisits: 9,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 555-1007",
    dob: "1972-12-05",
    gender: "Male",
    bloodGroup: "O-",
    address: "159 Birch Avenue, San Antonio, TX 78201",
    emergencyContact: "+1 555-9007",
    lastVisit: "2024-01-10",
    totalVisits: 25,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "Patricia Moore",
    email: "patricia.moore@email.com",
    phone: "+1 555-1008",
    dob: "1998-08-17",
    gender: "Female",
    bloodGroup: "AB-",
    address: "753 Walnut Drive, San Diego, CA 92101",
    emergencyContact: "+1 555-9008",
    lastVisit: "2024-01-21",
    totalVisits: 3,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
  },
];

export default function PatientsPage() {
  const [patients] = useState<Patient[]>(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeCount = patients.filter((p) => p.status === "Active").length;
  const inactiveCount = patients.filter((p) => p.status === "Inactive").length;

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const downloadPatientPDF = (patient: Patient) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(5, 115, 236);
    doc.text("MediCare Hub", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Patient Information Report", 105, 28, { align: "center" });

    // Patient Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Patient Details", 14, 45);

    doc.setFontSize(10);
    doc.setTextColor(60);

    const patientInfo = [
      ["Full Name", patient.name],
      ["Email", patient.email],
      ["Phone", patient.phone],
      ["Date of Birth", new Date(patient.dob).toLocaleDateString()],
      ["Age", `${calculateAge(patient.dob)} years`],
      ["Gender", patient.gender],
      ["Blood Group", patient.bloodGroup],
      ["Address", patient.address],
      ["Emergency Contact", patient.emergencyContact],
      ["Status", patient.status],
      ["Total Visits", patient.totalVisits.toString()],
      ["Last Visit", new Date(patient.lastVisit).toLocaleDateString()],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Value"]],
      body: patientInfo,
      theme: "striped",
      headStyles: { fillColor: [5, 115, 236] },
      styles: { fontSize: 10 },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated on ${new Date().toLocaleString()} - City General Hospital`,
      105,
      pageHeight - 10,
      { align: "center" },
    );

    doc.save(`patient-${patient.name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const downloadAllPatientsPDF = () => {
    const doc = new jsPDF("l"); // landscape

    // Header
    doc.setFontSize(20);
    doc.setTextColor(5, 115, 236);
    doc.text("MediCare Hub", 148, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("All Patients Report", 148, 28, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 148, 35, {
      align: "center",
    });

    // Table data
    const tableData = patients.map((p) => [
      p.name,
      p.email,
      p.phone,
      p.gender,
      p.bloodGroup,
      `${calculateAge(p.dob)} yrs`,
      p.totalVisits.toString(),
      new Date(p.lastVisit).toLocaleDateString(),
      p.status,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [
        [
          "Name",
          "Email",
          "Phone",
          "Gender",
          "Blood",
          "Age",
          "Visits",
          "Last Visit",
          "Status",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [5, 115, 236] },
      styles: { fontSize: 9 },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Total Patients: ${patients.length} | City General Hospital`,
      148,
      pageHeight - 10,
      { align: "center" },
    );

    doc.save("all-patients-report.pdf");
  };

  const getStatusBadge = (status: Patient["status"]) => {
    return (
      <Badge variant={status === "Active" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={patient.image} />
              <AvatarFallback>
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          {row.original.phone}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender / Age",
      cell: ({ row }) => (
        <div>
          <p>{row.original.gender}</p>
          <p className="text-sm text-muted-foreground">
            {calculateAge(row.original.dob)} years
          </p>
        </div>
      ),
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-semibold">
          {row.original.bloodGroup}
        </Badge>
      ),
    },
    {
      accessorKey: "totalVisits",
      header: "Total Visits",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.totalVisits}
        </span>
      ),
    },
    {
      accessorKey: "lastVisit",
      header: "Last Visit",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(row.original.lastVisit).toLocaleDateString("en-US", {
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
        const patient = row.original;
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
              <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadPatientPDF(patient)}>
                <FileDown className="h-4 w-4 mr-2" />
                Download PDF
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
            View and manage patient records
          </p>
        </div>
        <Button onClick={downloadAllPatientsPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export All to PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-500/10">
              <UserX className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inactiveCount}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={patients}
        searchKey="name"
        searchPlaceholder="Search patients..."
      />

      {/* Patient Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle>Patient Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedPatient.image} />
                    <AvatarFallback className="text-lg">
                      {selectedPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {selectedPatient.name}
                      </h3>
                      {getStatusBadge(selectedPatient.status)}
                    </div>
                    <p className="text-muted-foreground">
                      Patient ID: #{selectedPatient.id.padStart(6, "0")}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedPatient.gender},{" "}
                        {calculateAge(selectedPatient.dob)} years
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Born:{" "}
                        {new Date(selectedPatient.dob).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{selectedPatient.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>Emergency: {selectedPatient.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {selectedPatient.bloodGroup}
                    </p>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">
                      {selectedPatient.totalVisits}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Visits
                    </p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">
                      {new Date(selectedPatient.lastVisit).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Visit</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button onClick={() => downloadPatientPDF(selectedPatient)}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
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
