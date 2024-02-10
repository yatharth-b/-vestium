// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDrdbafQXduI4vRwQzFBqFinP2sh1JucFg",
  authDomain: "vestium-6516c.firebaseapp.com",
  projectId: "vestium-6516c",
  storageBucket: "vestium-6516c.appspot.com",
  messagingSenderId: "837344711591",
  appId: "1:837344711591:web:f97c539dcf64f335d81c82",
  measurementId: "G-JM7QKEV7E2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

export const signInWithGoogle = () => signInWithPopup(auth, provider)

