// firebase.js - ganti config dengan milikmu dari Firebase Console
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIgbQy8ggZr6thFmBCiv3UviZ2XHQzyuQ",
  authDomain: "rentak-dd050.firebaseapp.com",
  projectId: "rentak-dd050",
  storageBucket: "rentak-dd050.firebasestorage.app",
  messagingSenderId: "43640732554",
  appId: "1:43640732554:web:a03249bad528e1e6b62673",
  measurementId: "G-M63ED3KCYR",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
