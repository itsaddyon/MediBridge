import admin from "firebase-admin";
import path from "path";
import fs from "fs";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(fs.readFileSync(path.join(__dirname, "../serviceAccountKey.json"), "utf8"))
    ),
  });
}

export const db = admin.firestore();
