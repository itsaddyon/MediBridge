// CreateReferral.tsx
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PATIENTS_KEY = "medibridge_patients_list";
const REF_KEY = "medibridge_referrals_list";

type Patient = {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  contact?: string;
  createdAt: string;
  notes?: string;
};

type Referral = {
  id: string;
  patientId: string;
  patientName: string;
  hospital: string;
  department: string;
  urgency: string;
  symptoms: string;
  diagnosis?: string;
  tests?: string;
  medications?: string;
  status: "pending" | "accepted" | "diagnosed" | "closed";
  date: string;
};

function readPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readReferrals(): Referral[] {
  try {
    const raw = localStorage.getItem(REF_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReferrals(list: Referral[]) {
  try {
    localStorage.setItem(REF_KEY, JSON.stringify(list));
  } catch {}
}

export default function CreateReferral() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(() => readPatients());
  const [formData, setFormData] = useState({
    patientId: "",
    hospital: "",
    department: "",
    urgency: "",
    symptoms: "",
    diagnosis: "",
    tests: "",
    medications: "",
  });

  useEffect(() => {
    // ensure referrals array exists
    if (localStorage.getItem(REF_KEY) == null) localStorage.setItem(REF_KEY, JSON.stringify([]));
    if (localStorage.getItem(PATIENTS_KEY) == null) localStorage.setItem(PATIENTS_KEY, JSON.stringify([]));

    const handler = (e: StorageEvent) => {
      if (e.key === PATIENTS_KEY) setPatients(readPatients());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // refresh patients from storage if the component mounts
  useEffect(() => {
    setPatients(readPatients());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!formData.patientId) {
      toast.error("Please select a patient");
      return;
    }
    if (!formData.hospital || !formData.department || !formData.urgency || !formData.symptoms) {
      toast.error("Please fill required fields");
      return;
    }

    const patient = patients.find((p) => p.id === formData.patientId);
    const newReferral: Referral = {
      id: `r_${Date.now()}`,
      patientId: formData.patientId,
      patientName: patient ? patient.name : "Unknown",
      hospital: formData.hospital,
      department: formData.department,
      urgency: formData.urgency,
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      tests: formData.tests,
      medications: formData.medications,
      status: "pending",
      date: new Date().toISOString(),
    };

    const list = readReferrals();
    const next = [newReferral, ...list];
    writeReferrals(next);

    // trigger storage event for other tabs/components (best-effort)
    try {
      window.dispatchEvent(new StorageEvent("storage", { key: REF_KEY, newValue: JSON.stringify(next) }));
    } catch {}

    toast.success("Referral created successfully!");
    navigate("/clinic/referral-status");
  };

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Referral</h1>
          <p className="text-muted-foreground mt-2">Refer a patient to a specialist or hospital</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Referral Details</CardTitle>
            <CardDescription>Complete all fields to create a new referral</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Select Patient *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((s) => ({
                      ...s,
                      patientId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={patients.length ? "Search and select patient" : "No patients yet"} />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length === 0 ? (
                      <SelectItem value="none">No patients — register a patient first</SelectItem>
                    ) : (
                      patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} {p.age ? `- Age ${p.age}` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hospital">Referring To *</Label>
                  <Select
                    onValueChange={(value) => setFormData((s) => ({ ...s, hospital: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="District Hospital">District Hospital</SelectItem>
                      <SelectItem value="City Medical Center">City Medical Center</SelectItem>
                      <SelectItem value="Specialty Care Hospital">Specialty Care Hospital</SelectItem>
                      <SelectItem value="Government General Hospital">Government General Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select onValueChange={(value) => setFormData((s) => ({ ...s, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select onValueChange={(value) => setFormData((s) => ({ ...s, urgency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical - Immediate attention required</SelectItem>
                    <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                    <SelectItem value="routine">Routine - Within a week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe the patient's symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData((s) => ({ ...s, symptoms: e.target.value }))}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Preliminary Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Your preliminary diagnosis or observations"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData((s) => ({ ...s, diagnosis: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tests">Tests Conducted</Label>
                <Textarea
                  id="tests"
                  placeholder="List any tests already conducted and their results"
                  value={formData.tests}
                  onChange={(e) => setFormData((s) => ({ ...s, tests: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications being administered"
                  value={formData.medications}
                  onChange={(e) => setFormData((s) => ({ ...s, medications: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">Create Referral</Button>
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
