"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env"),
});
// Routes
const gemini_1 = __importDefault(require("./routes/gemini"));
// import authRoutes from "./routes/auth";     // 🚧 TODO: Refactor these to use Firebase instead of Mongoose
// import patientRoutes from "./routes/patients"; // 🚧 TODO: Refactor these to use Firebase instead of Mongoose
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get("/health", (req, res) => {
    res.json({ ok: true, database: "Firebase" });
});
// Gemini AI Chatbot Route
// Ensure your 'routes/gemini.ts' imports 'db' from your 'firebase.ts' file!
app.use("/api/gemini", gemini_1.default);
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
app.get("/api/debug/models", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = yield genAI.listModels();
        res.json({
            ok: true,
            models: models.models.map((m) => ({
                name: m.name,
                supportedGenerationMethods: m.supportedGenerationMethods,
            })),
        });
    }
    catch (err) {
        console.error("Model list error:", err);
        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}));
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
