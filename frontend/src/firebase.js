// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Pastikan getAuth diimpor
// import { getAnalytics } from "firebase/analytics"; // Dinonaktifkan untuk sementara
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs5xHBwrIAvgQtLhqlkkzLRfsSTlAKwO0",
  authDomain: "chai-ai-e2041.firebaseapp.com",
  projectId: "chai-ai-e2041",
  storageBucket: "chai-ai-e2041.appspot.com", // .firebasestorage.app seringkali salah, .appspot.com lebih umum
  messagingSenderId: "221725001477",
  appId: "1:221725001477:web:3064f6ff94e3859531596c",
  // measurementId: "G-F5P1D24292" // Dinonaktifkan untuk sementara
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Dinonaktifkan untuk sementara

// Inisialisasi dan ekspor Auth
export const auth = getAuth(app);