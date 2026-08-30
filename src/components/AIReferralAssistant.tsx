import React, { useState } from "react";
import { Bot, Loader2, Sparkles, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface AIReferralAssistantProps {
  patientData: any;
  onSummaryGenerated: (summary: string) => void;
}

export default function AIReferralAssistant({ patientData, onSummaryGenerated }: AIReferralAssistantProps) {
  const [draftNotes, setDraftNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateSummary = async () => {
    if (!draftNotes.trim() && !patientData) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const BACKEND_URL = import.meta.env.DEV
        ? "http://localhost:4000"
        : import.meta.env.VITE_BACKEND_URL;

      const payload = {
        mode: "referral_summary",
        patientData: patientData,
        draftNotes: draftNotes
      };

      const response = await fetch(`${BACKEND_URL}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate summary");

      if (data.response) {
        onSummaryGenerated(data.response);
        setSuccess(true);
      }
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-cyan-900/50 bg-slate-900/50 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-cyan-400" />
        <h4 className="font-semibold text-slate-200">AI Referral Assistant</h4>
      </div>
      
      <p className="text-sm text-slate-400 mb-3">
        Briefly describe the patient's symptoms or observations. The AI will structure this into a professional referral note.
      </p>

      <textarea
        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 min-h-[80px]"
        placeholder="e.g. Patient has severe chest pain radiating to left arm. Sweating. High BP."
        value={draftNotes}
        onChange={(e) => setDraftNotes(e.target.value)}
        disabled={isLoading}
      />

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900/50">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-2 flex items-center gap-2 text-green-400 text-sm bg-green-950/30 p-2 rounded border border-green-900/50">
          <CheckCircle className="h-4 w-4" />
          Summary generated successfully!
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button 
          type="button"
          onClick={generateSummary}
          disabled={isLoading || (!draftNotes.trim() && !patientData)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
          {isLoading ? "Generating..." : "Generate Structured Summary"}
        </Button>
      </div>
    </div>
  );
}
