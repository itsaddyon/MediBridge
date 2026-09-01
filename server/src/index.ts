import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// Routes
import geminiRoutes from "./routes/gemini"; 
// import authRoutes from "./routes/auth";     // 🚧 TODO: Refactor these to use Firebase instead of Mongoose
// import patientRoutes from "./routes/patients"; // 🚧 TODO: Refactor these to use Firebase instead of Mongoose


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, database: "Firebase" });
});

// Gemini AI Chatbot Route
// Ensure your 'routes/gemini.ts' imports 'db' from your 'firebase.ts' file!
app.use("/api/gemini", geminiRoutes);

// Mock locations (Hardcoded Map Data)
app.get("/api/locations", (req, res) => {
  const locations = [
    { id: "c1", type: "clinic", name: "PHC Rampur", lat: 26.889, lng: 80.7831 },
    { id: "d1", type: "doctor", name: "Dr. Meera Sharma", lat: 19.076, lng: 72.8777 },
    { id: "p1", type: "pharmacy", name: "Sundar Pharmacy", lat: 22.7, lng: 75.9 },
    { id: "l1", type: "lab", name: "Rapid Labs", lat: 23.25, lng: 77.41 },
    { id: "a1", type: "ambulance", name: "Ambulance 144", lat: 21.1458, lng: 79.0882 }
  ];

  res.json(locations);
});

// Server
const port = process.env.PORT || 4000;
app.get("/api/debug/models", async (_req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const models = await (genAI as any).listModels();

    res.json({
      ok: true,
      models: models.models.map((m: any) => ({
        name: m.name,
        supportedGenerationMethods: m.supportedGenerationMethods,
      })),
    });
  } catch (err: unknown) {
    console.error("Model list error:", err);
    res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});