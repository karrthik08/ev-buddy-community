import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyADXpVIyhrm0mQwK27kMC6HUsQvKS8uaq4",
  authDomain: "communehub-fe28e.firebaseapp.com",
  projectId: "communehub-fe28e",
  storageBucket: "communehub-fe28e.firebasestorage.app",
  messagingSenderId: "90532759827",
  appId: "1:90532759827:web:f3233c170825eee9ce72e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
