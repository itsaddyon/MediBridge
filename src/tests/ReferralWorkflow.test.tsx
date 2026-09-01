import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import CreateReferral from "../pages/clinic/CreateReferral";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { toast } from "../components/ui/use-toast";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock dependencies
vi.mock("../lib/patientService", () => ({
  getAllPatients: vi.fn().mockResolvedValue([
    { id: "1", name: "John Doe" }
  ])
}));

vi.mock("../lib/hospitalService", () => ({
  listenHospitals: vi.fn((callback) => {
    callback([
      { id: "h1", name: "General Hospital", totalBeds: 10, availableBeds: 5 }
    ]);
    return vi.fn(); // unsubscribe fn
  })
}));

vi.mock("../lib/referralService", () => ({
  createReferralDB: vi.fn().mockResolvedValue(true)
}));

vi.mock("../components/ui/use-toast", () => ({
  toast: vi.fn()
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CreateReferral Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows error toast if required fields are missing", async () => {
    await act(async () => {
      renderWithRouter(<CreateReferral />);
    });
    
    const submitBtn = screen.getByRole("button", { name: "Create Referral" });
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ title: "Please select a patient" });
    });
  });

  // Note: Radix UI Select components can be tricky to test with basic RTL fireEvent.
  // We're mostly ensuring the component renders without crashing and basic validation works.
  it("renders the form and AI assistant", async () => {
    await act(async () => {
      renderWithRouter(<CreateReferral />);
    });
    
    expect(screen.getByRole("heading", { name: "Create Referral" })).toBeInTheDocument();
    expect(screen.getByText("AI Referral Assistant")).toBeInTheDocument();
  });
});
