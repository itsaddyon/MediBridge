import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

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
app.get("/api/debug/models", async (_req: any, res: any) => {
  try {
    const GoogleGenerativeAI =
      require("@google/generative-ai").GoogleGenerativeAI;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = await genAI.listModels();

    res.json({
      ok: true,
      models: models.models.map((m: any) => ({
        name: m.name,
        supportedGenerationMethods: m.supportedGenerationMethods,
      })),
    });
  } catch (err: any) {
    console.error("Model list error:", err);
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});