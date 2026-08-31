import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatusBadge } from "../components/StatusBadge";
import { PatientCard } from "../components/PatientCard";
import { ReferralCard } from "../components/ReferralCard";
import { StatsCard } from "../components/StatsCard";
import { User } from "lucide-react";
import React from "react";

describe("Dashboard Components", () => {
  it("renders StatusBadge correctly", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toHaveClass("status-warning");
  });

  it("renders PatientCard correctly", () => {
    render(
      <PatientCard
        name="John Doe"
        age={30}
        gender="Male"
        location="Delhi"
        phone="1234567890"
        registrationDate="2023-01-01"
      />
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("30 years • Male")).toBeInTheDocument();
    expect(screen.getByText("Delhi")).toBeInTheDocument();
  });

  it("renders ReferralCard correctly", () => {
    const mockReferral = {
      id: "1",
      patientName: "Jane Doe",
      hospital: "City Hospital",
      department: "Cardiology",
      urgency: "high",
      symptoms: "Chest pain",
      status: "accepted" as const,
    };
    render(<ReferralCard referral={mockReferral} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("City Hospital")).toBeInTheDocument();
    expect(screen.getByText("Chest pain")).toBeInTheDocument();
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });

  it("renders StatsCard correctly", () => {
    render(
      <StatsCard
        title="Total Patients"
        value={120}
        icon={User}
        trend={{ value: "5%", isPositive: true }}
      />
    );
    expect(screen.getByText("Total Patients")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
