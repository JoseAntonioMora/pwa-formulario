// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1AgYeGR8gT5DPCcylaK3U_F9oQ8Q_wKI",
  authDomain: "react-app-notes-c882b.firebaseapp.com",
  projectId: "react-app-notes-c882b",
  storageBucket: "react-app-notes-c882b.firebasestorage.app",
  messagingSenderId: "533150793832",
  appId: "1:533150793832:web:37a49eb04d5ad84ae5bbdd",
  measurementId: "G-MMBVDLWCJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);