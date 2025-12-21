import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  // 1. Check for the Environment Variable (Production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // Parse the JSON string from the environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // Fix for potential newline issues in the private key
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin initialized via Env Var");
    } catch (err) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", err);
    }
  } 
  // 2. Fallback for Local Development
  else {
    try {
      const serviceAccount = require("../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin initialized via Local JSON");
    } catch (err) {
      console.error("❌ Firebase credentials not found in Env or Local File");
    }
  }
}

export const db = admin.firestore();