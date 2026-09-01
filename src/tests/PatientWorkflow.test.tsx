import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RegisterPatient from "../pages/clinic/RegisterPatient";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { toast } from "sonner";
import { registerPatient } from "../lib/patientService";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("../lib/patientService", () => ({ registerPatient: vi.fn() }));

describe("RegisterPatient Workflow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows error toast if required fields are missing", async () => {
    await act(async () => {
      render(<BrowserRouter><RegisterPatient /></BrowserRouter>);
    });
    const submitBtn = screen.getByRole("button", { name: "Register Patient" });
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    expect(toast.error).toHaveBeenCalledWith("Please fill all required fields");
  });

  it("renders the form elements correctly", async () => {
    await act(async () => {
      render(<BrowserRouter><RegisterPatient /></BrowserRouter>);
    });
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register Patient" })).toBeInTheDocument();
  });
});
