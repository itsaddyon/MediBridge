import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AIReferralAssistant from "../components/AIReferralAssistant";
import React from "react";

// Mock the global fetch
global.fetch = vi.fn();

describe("AIReferralAssistant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<AIReferralAssistant patientData={{}} onSummaryGenerated={vi.fn()} />);
    expect(screen.getByText("AI Referral Assistant")).toBeInTheDocument();
  });

  it("shows loading state when generating summary", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Test summary" })
    });

    render(<AIReferralAssistant patientData={{}} onSummaryGenerated={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/e\.g\. Patient has severe chest pain/i);
    fireEvent.change(input, { target: { value: "Test symptoms" } });
    
    const button = screen.getByText("Generate Structured Summary");
    fireEvent.click(button);
    
    expect(screen.getByText("Generating...")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Summary generated successfully!")).toBeInTheDocument();
    });
  });

  it("handles errors from the API", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "API Failure" })
    });

    render(<AIReferralAssistant patientData={{}} onSummaryGenerated={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/e\.g\. Patient has severe chest pain/i);
    fireEvent.change(input, { target: { value: "Test symptoms" } });
    
    const button = screen.getByText("Generate Structured Summary");
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText("API Failure")).toBeInTheDocument();
    });
  });
});
