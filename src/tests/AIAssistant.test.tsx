import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AIReferralAssistant from "../components/AIReferralAssistant";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";

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
    const mockSummary = {
      symptoms: ["Chest pain"],
      urgency: "high",
      missingInfo: ["ECG results"],
      suggestedQuestions: ["When did it start?"]
    };

    (global.fetch as unknown).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockSummary })
    });

    render(<AIReferralAssistant patientData={{}} onSummaryGenerated={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/e\.g\. Patient has severe chest pain/i);
    fireEvent.change(input, { target: { value: "Test symptoms" } });
    
    const button = screen.getByText("Generate Structured Summary");
    fireEvent.click(button);
    
    expect(screen.getByText("Generating...")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Structured AI Summary Generated")).toBeInTheDocument();
      expect(screen.getByText("Chest pain")).toBeInTheDocument();
    });
  });

  it("handles errors from the API", async () => {
    (global.fetch as unknown).mockResolvedValueOnce({
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

  it("shows controlled fallback message on 503 Service Unavailable", async () => {
    (global.fetch as unknown).mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({
        success: false,
        error: {
          code: "AI_SERVICE_UNAVAILABLE",
          message: "The AI service is temporarily unavailable."
        }
      })
    });

    render(<AIReferralAssistant patientData={{}} onSummaryGenerated={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/e\.g\. Patient has severe chest pain/i);
    fireEvent.change(input, { target: { value: "Test symptoms" } });
    
    const button = screen.getByText("Generate Structured Summary");
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText("AI assistance is temporarily unavailable. You can continue creating the referral manually.")).toBeInTheDocument();
    });
  });
});
