import admin from "firebase-admin";
import path from "path";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require(path.join(__dirname, "../serviceAccountKey.json"))
    ),
  });
}

export const db = admin.firestore();
