import express from "express";
import { db } from "../firebase"; 
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// 1. Initialize the SDK with your API Key
// Ensure the variable name matches what you set in Render (GEMINI_API_KEY)
console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "models/gemini-flash-latest",
});


router.post("/", async (req, res) => {
  try {
    const { message, userId, userLocation } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const currentLocation = userLocation || "Unknown Location";

    let history: any[] = [];

try {
  const chatRef = db.collection("chats").doc(userId || "guest");
  const doc = await chatRef.get();
  history = doc.exists ? doc.data()?.history || [] : [];
} catch (err) {
  console.warn("Firestore unavailable, continuing without history");
}


    // 3. Define the System Prompt
    const SYSTEM_PROMPT = `
You are MediBridge. A chatbot to help user curing at your best. User location: ${currentLocation}.

ANALYZE USER INTENT FIRST:

SCENARIO A: MEDICAL SYMPTOMS / PAIN / HOSPITAL SEARCH
- Try giving natural advices of curing the mentioned problems within 2 sentence.
- IMMEDIATELY follow with a VALID HTML TABLE.
- The table MUST:
  - Use <table>, <thead>, <tbody>, <tr>, <th>, <td>
  - NOT use Markdown pipes (|)
  - Be browser-renderable
  - Include 3 nearest facilities
- At the end, it gives link to the address of those facilities.
- Assure the user that it will be cured quickly and not a major unwellness.

SCENARIO B: GENERAL WELLNESS / HEALTH ADVICE / ANY OTHER THINGS
- Give helpful advice.
- DO NOT include any table.
`;


    // 4. Initialize Chat with History
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I will detect intent and only show the table for medical needs." }] },
        ...history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        }))
      ]
    });

    // 5. Send Message and Get Response
    const result = await chat.sendMessage(message);
    const replyText = result.response.text();

    // 6. Save new messages back to Firebase
    const newMessages = [
      { role: "user", text: message, timestamp: new Date() },
      { role: "model", text: replyText, timestamp: new Date() },
    ];

    try {
  const chatRef = db.collection("chats").doc(userId || "guest");
  await chatRef.set(
    { history: [...history, ...newMessages], lastUpdated: new Date() },
    { merge: true }
  );
} catch (err) {
  console.warn("Failed to save chat history, skipping");
}


    res.json({ response: replyText });

  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    res.status(500).json({ 
      error: "Failed to connect to AI service",
      details: error.message 
    });
  }
});

export default router;