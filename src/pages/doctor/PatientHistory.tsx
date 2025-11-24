import { DashboardLayout } from "@/components/DashboardLayout";
import { PatientCard } from "@/components/PatientCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function PatientHistory() {
  const patients = [
    {
      name: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      location: "Village A",
      phone: "+91 98765 43210",
      registrationDate: "2025-10-15",
    },
    {
      name: "Priya Sharma",
      age: 32,
      gender: "Female",
      location: "Village B",
      phone: "+91 98765 43211",
      registrationDate: "2025-10-20",
    },
    {
      name: "Amit Singh",
      age: 58,
      gender: "Male",
      location: "Village C",
      phone: "+91 98765 43212",
      registrationDate: "2025-10-25",
    },
    {
      name: "Sneha Patel",
      age: 28,
      gender: "Female",
      location: "Village A",
      phone: "+91 98765 43213",
      registrationDate: "2025-11-01",
    },
    {
      name: "Vikram Reddy",
      age: 51,
      gender: "Male",
      location: "Village D",
      phone: "+91 98765 43214",
      registrationDate: "2025-11-05",
    },
    {
      name: "Lakshmi Nair",
      age: 39,
      gender: "Female",
      location: "Village B",
      phone: "+91 98765 43215",
      registrationDate: "2025-11-10",
    },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient History</h1>
          <p className="text-muted-foreground mt-2">View complete patient records and treatment history</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            className="pl-10"
          />
        </div>

        {/* Patient Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient, index) => (
            <PatientCard key={index} {...patient} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
