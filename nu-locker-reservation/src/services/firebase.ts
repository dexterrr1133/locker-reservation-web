// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoXfLiwgxbXtw4ouVKqjtPQRDxfqwIX9I",
  authDomain: "locker-reservation-nu.firebaseapp.com",
  databaseURL: "https://locker-reservation-nu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "locker-reservation-nu",
  storageBucket: "locker-reservation-nu.firebasestorage.app",
  messagingSenderId: "103448669942",
  appId: "1:103448669942:web:0a68d7cfc20266e50086d7",
  measurementId: "G-27RPTSSR3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)