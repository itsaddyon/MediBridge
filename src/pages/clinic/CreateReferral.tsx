import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import { getAllPatients } from "@/lib/patientService";
import { createReferralDB } from "@/lib/referralService";
import { readHospitals, HospitalBed } from "@/lib/bedStore";

type Hospital = HospitalBed;

export default function CreateReferral() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

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

  /* Load patients */
  useEffect(() => {
    getAllPatients().then(setPatients);
  }, []);

  /* ✅ Load ONLY real hospitals (no dummy data) */
  useEffect(() => {
    const realHospitals = readHospitals().filter(
      h => h.name && h.totalBeds > 0
    );
    setHospitals(realHospitals);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId) {
      toast({ title: "Please select a patient" });
      return;
    }

    if (!formData.hospital || !formData.department || !formData.urgency) {
      toast({ title: "Please fill all required fields" });
      return;
    }

    const patient = patients.find((p) => p.id === formData.patientId);

    try {
      await createReferralDB({
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
      });

      toast({ title: "Referral created successfully" });
      navigate("/clinic/referral-status");
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create referral" });
    }
  };

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Create Referral</h1>
          <p className="text-muted-foreground mt-2">
            Refer a patient to a hospital or specialist
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient */}
          <Select
            value={formData.patientId}
            onValueChange={(v) => handleChange("patientId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Hospital */}
          <Select
            value={formData.hospital}
            onValueChange={(v) => handleChange("hospital", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Hospital (Live Beds)" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((h) => (
                <SelectItem
                  key={h.id}
                  value={h.name}
                  disabled={h.availableBeds === 0}
                >
                  {h.name} — Beds: {h.availableBeds}/{h.totalBeds}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Department"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
          />

          <Select
            value={formData.urgency}
            onValueChange={(v) => handleChange("urgency", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Urgency Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Symptoms / Reason for referral"
            value={formData.symptoms}
            onChange={(e) => handleChange("symptoms", e.target.value)}
          />

          <Textarea
            placeholder="Diagnosis (optional)"
            value={formData.diagnosis}
            onChange={(e) => handleChange("diagnosis", e.target.value)}
          />

          <Textarea
            placeholder="Tests done (optional)"
            value={formData.tests}
            onChange={(e) => handleChange("tests", e.target.value)}
          />

          <Textarea
            placeholder="Medications (optional)"
            value={formData.medications}
            onChange={(e) => handleChange("medications", e.target.value)}
          />

          <Button type="submit">Create Referral</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
