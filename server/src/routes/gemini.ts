import express from "express";
import { db } from "../firebase"; 
import fetch from "node-fetch";    

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, userId, userLocation } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server error" });

    const currentLocation = userLocation || "Unknown Location";
    
    // 🧠 SMART PROMPT: Distinguishes between Emergency vs Wellness
    const SYSTEM_PROMPT = `
    You are MediBridge. User location: ${currentLocation}.
    
    ANALYZE USER INTENT FIRST:
    
    **SCENARIO A: MEDICAL SYMPTOMS / PAIN / HOSPITAL SEARCH**
    (e.g., "I have chest pain", "Find doctor", "My arm hurts", "Fever")
    - Response: Max 2 sentences of empathy/action.
    - **REQUIRED:** Follow immediately with the HTML Table of 3 nearest facilities.
    - Format:
      <table class="medical-table">
      <tr><th>Facility</th><th>Type</th><th>Action</th></tr>
      <tr><td>[Name]</td><td>[Specialty]</td><td><a href="https://www.google.com/maps/search/?api=1&query=[Name]+${currentLocation}" target="_blank" class="map-link">📍 Map</a></td></tr>
      </table>

    **SCENARIO B: WELLNESS / YOGA / DIET / GENERAL CHAT**
    (e.g., "Suggest yoga for stress", "Healthy diet tips", "Hi", "Who are you")
    - Response: Provide a helpful, friendly, and structured text response. 
    - **DO NOT** show the hospital table.
    - Use <b>bolding</b> for key tips. Keep it under 4 sentences.

    Now answer the user's message based on these rules.
    `;

    const chatRef = db.collection("chats").doc(userId || "guest_landing_page");
    const docSnap = await chatRef.get();
    let history = docSnap.exists ? docSnap.data()?.history || [] : [];

    const contents = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I will detect intent and only show the table for medical needs." }] }
    ];

    history.forEach((h: any) => {
        contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
        });
    });

    contents.push({ role: "user", parts: [{ text: message }] });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data: any = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API error");

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "System busy.";

    const newMessages = [
      { role: "user", text: message, timestamp: new Date() },
      { role: "model", text: replyText, timestamp: new Date() },
    ];

    await chatRef.set({
        history: [...history, ...newMessages],
        lastUpdated: new Date(),
        userId: userId || "guest"
    }, { merge: true });

    res.json({ response: replyText });

  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;