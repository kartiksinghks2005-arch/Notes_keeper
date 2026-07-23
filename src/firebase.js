import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaAD6AO9KE5UBZK4GP0hLSy7XCgnxyxCg",
  authDomain: "notes-keeper-3cb96.firebaseapp.com",
  projectId: "notes-keeper-3cb96",
  storageBucket: "notes-keeper-3cb96.firebasestorage.app",
  messagingSenderId: "136707470300",
  appId: "1:136707470300:web:d8e0591e16bde5bb161519",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();