import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXOpeb6Phmuwpapl07mi70Quy8lgg-0y8",
  authDomain: "medibridge-cbe84.firebaseapp.com",
  projectId: "medibridge-cbe84",
  storageBucket: "medibridge-cbe84.firebasestorage.app",
  messagingSenderId: "884589594368",
  appId: "1:884589594368:web:ce8d8d093dffe8be3715e5",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;