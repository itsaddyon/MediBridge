import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // 🚨 UPDATED FIX: This handles both escaped and literal newlines
      // This version is more resilient to how different platforms store JSON strings.
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.split('\\n').join('\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin successfully authenticated");
    } catch (error) {
      console.error("❌ Firebase Auth Error:", error);
    }
  } else {
    try {
      // Local fallback
      const serviceAccount = require("../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      console.error("❌ No Firebase credentials found");
    }
  }
}

export const db = admin.firestore();