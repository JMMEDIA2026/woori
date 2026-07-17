import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "gen-lang-client-0904561341",
  appId: "1:988067109970:web:91e46b8e6c26eca796538b",
  apiKey: "AIzaSyDuETTB8Zf70pabtcFufpRXZzhd6_EarLU",
  authDomain: "gen-lang-client-0904561341.firebaseapp.com",
  storageBucket: "gen-lang-client-0904561341.firebasestorage.app",
  messagingSenderId: "988067109970",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
