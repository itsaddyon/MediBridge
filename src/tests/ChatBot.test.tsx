import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatBot from "../components/ChatBot";
import { vi } from "vitest";
import React from "react";

global.fetch = vi.fn();

describe("ChatBot Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly and toggles open/close", () => {
    render(<ChatBot />);
    const toggleButton = screen.getByLabelText("Toggle ChatBot");
    expect(toggleButton).toBeInTheDocument();

    // Open chat
    fireEvent.click(toggleButton);
    expect(screen.getByText("MediBridge", { selector: 'h3' })).toBeInTheDocument();

    // Close chat
    fireEvent.click(toggleButton);
    expect(screen.queryByText("MediBridge", { selector: 'h3' })).not.toBeInTheDocument();
  });

  it("sends a message and handles API response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Hello from AI" })
    });

    render(<ChatBot />);
    const toggleButton = screen.getByLabelText("Toggle ChatBot");
    fireEvent.click(toggleButton);

    const input = screen.getByPlaceholderText("Type health query...");
    fireEvent.change(input, { target: { value: "I have a headache" } });
    
    // Using keydown for enter
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
    expect(screen.getByText("Processing...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Hello from AI")).toBeInTheDocument();
    });
  });

  it("handles quick action click", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Here are hospitals" })
    });

    render(<ChatBot />);
    fireEvent.click(screen.getByLabelText("Toggle ChatBot"));

    const quickAction = screen.getByText("Find Hospitals");
    fireEvent.click(quickAction);

    await waitFor(() => {
      expect(screen.getByText("Here are hospitals")).toBeInTheDocument();
    });
  });

  it("handles API error", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" })
    });

    render(<ChatBot />);
    fireEvent.click(screen.getByLabelText("Toggle ChatBot"));

    const input = screen.getByPlaceholderText("Type health query...");
    fireEvent.change(input, { target: { value: "Test error" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/Server error/)).toBeInTheDocument();
    });
  });
});
