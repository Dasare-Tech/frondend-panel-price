// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBIddcO7pugslU8_v0kcGhS50wdEngm31c",
  authDomain: "panel-price-76c09.firebaseapp.com",
  projectId: "panel-price-76c09",
  storageBucket: "panel-price-76c09.firebasestorage.app",
  messagingSenderId: "1040245234773",
  appId: "1:1040245234773:web:7f9eda6caadc5ac44148dc",
  measurementId: "G-FZDM5CG0EE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
