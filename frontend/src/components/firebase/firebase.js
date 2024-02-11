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

// .Request {
//   width: 100vw;
//   height: 100vh;
//   background: #FBEAD2;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   overflow-x: hidden;
// }
// .RequestImage {
//   margin-top: 50px;
//   min-width: 300px;
//   min-height: 200px;
//   width: 30%;
//   display: flex;
//   /* padding: 20px; */
//   background-color: rebeccapurple;
//   border-radius: 8px;
//   position: relative;
//   overflow: hidden;
// }

// .RequestCardContent {
//   align-self: flex-end;
//   position: absolute;
//   padding: 20px;
//   color: white;
// }



// .RequestCardDate {
//   font-size: 28px;
// }

// .RequestImageImage {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   position: absolute;
// }

// .RequestGradient {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   position: absolute;
//   background: linear-gradient(29deg, #000 5.52%, rgba(255, 255, 255, 0.00) 106.33%)
// }

// .Recommendations {
//   margin-top: 50px;
//   margin-left: 50px;
//   display: flex;
//   width: 100vw;
//   overflow-x: auto;
//   column-gap: 25px;
// }

// .RecommendationCard {
//   min-width: 200px;
//   height: 300px;
//   margin-left: 15px;
//   margin-right: 15px;
//   position: relative;
//   border-radius: 8px;
//   overflow: hidden;
//   display: flex;
//   /* flex-direction: column; */
// } 

// .RecommendationCardNum {
//   font-size: 12px;
// }

// .RecommendationImage {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   position: absolute;
// }

// .RecommendationCardContent {
//   position: absolute;
//   color: white;
//   padding: 20px;
//   align-self: flex-end;
// }

// .SlugHeader {
//   display: flex;
//   padding: 20px;
//   align-items: center;
//   font-size: 32px;
//   align-self: flex-start;
// }

// .BackArrow {
//   width: 60px;
//   height: 60px;
// }

// .SlugHeaderLink {
//   align-self: fle;
// }