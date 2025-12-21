import * as admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  try {
    // 🚨 Render stores Secret Files in /opt/render/project/src/
    // This logic handles both Render and your local machine.
    const serviceAccountPath = process.env.RENDER 
      ? path.join(process.cwd(), "serviceAccountKey.json") 
      : path.join(__dirname, "../serviceAccountKey.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
    console.log("✅ Firebase Admin successfully authenticated");
  } catch (error) {
    console.error("❌ Firebase Auth Error:", error);
  }
}

export const db = admin.firestore();