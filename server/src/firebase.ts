import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  // Check if we are using the JSON string from Environment Variables (Best for Production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Fallback for local development if you still have the file
    try {
      const serviceAccount = require("../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      console.error("Firebase Initialization Error: No credentials found.");
    }
  }
}

export const db = admin.firestore();