
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoXfLiwgxbXtw4ouVKqjtPQRDxfqwIX9I",
  authDomain: "locker-reservation-nu.firebaseapp.com",
  databaseURL: "https://locker-reservation-nu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "locker-reservation-nu",
  storageBucket: "locker-reservation-nu.firebasestorage.app",
  messagingSenderId: "103448669942",
  appId: "1:103448669942:web:0a68d7cfc20266e50086d7",
  measurementId: "G-27RPTSSR3C",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };

setPersistence(auth, browserSessionPersistence);



