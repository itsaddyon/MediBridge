import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // 1. Parse the JSON string
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // 2. 🚨 THE FIX: More aggressive newline replacement
      // Sometimes it's double-escaped (\\n) and sometimes it's literal.
      // This ensures the SDK sees a REAL newline character.
      if (typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin initialized via Environment Variable");
    } catch (error) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
    }
  } else {
    try {
      const serviceAccount = require("../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin initialized via local JSON");
    } catch (error) {
      console.error("❌ Firebase credentials not found in Env or Local File");
    }
  }
}

export const db = admin.firestore();