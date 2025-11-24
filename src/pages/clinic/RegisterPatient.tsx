// RegisterPatient.tsx
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PATIENTS_KEY = "medibridge_patients_list";

type Patient = {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  createdAt: string;
};

function readPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writePatients(arr: Patient[]) {
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(arr));
  } catch {}
}

export default function RegisterPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.address || !formData.emergencyContact) {
      toast.error("Please fill all required fields");
      return;
    }

    const list = readPatients();
    const newPatient: Patient = {
      id: `p_${Date.now()}`,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      medicalHistory: formData.medicalHistory,
      createdAt: new Date().toISOString(),
    };

    const next = [newPatient, ...list];
    writePatients(next);

    // broadcast change to other tabs/components
    try {
      window.dispatchEvent(new StorageEvent("storage", { key: PATIENTS_KEY, newValue: JSON.stringify(next) }));
    } catch {}

    toast.success("Patient registered successfully!");
    navigate("/clinic/dashboard");
  };

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Register New Patient</h1>
          <p className="text-muted-foreground mt-2">Add a new patient to the electronic health records system</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter complete patient details for EHR</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter patient's full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Enter any relevant medical history, allergies, or chronic conditions"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">Register Patient</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/clinic/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
