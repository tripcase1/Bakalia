import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSMy4suf-HYnt3d6PRotQyXwOZEy2nCdU",
  authDomain: "bakalia-ctg.firebaseapp.com",
  projectId: "bakalia-ctg",
  storageBucket: "bakalia-ctg.firebasestorage.app",
  messagingSenderId: "503566948480",
  appId: "1:503566948480:web:35f3094291c0ddf874ae65",
  measurementId: "G-9REQ25FZJ9"
};

// Initialize Firebase (checking if already initialized to avoid duplicate apps in hot-reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth, Firestore, and Storage Databases
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only on the client side if supported
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
