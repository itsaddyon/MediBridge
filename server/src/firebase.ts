import * as admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  // Point this to where you saved the json file
  const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();