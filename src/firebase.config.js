// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLNa0Sf_L5iYdLxieBA4uuQEBeiHWyrEc",
  authDomain: "recipe-app-be7f2.firebaseapp.com",
  projectId: "recipe-app-be7f2",
  storageBucket: "recipe-app-be7f2.appspot.com",
  messagingSenderId: "838088946443",
  appId: "1:838088946443:web:95066dfa204005cbf9a80e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firestore database
const db = getFirestore(app);

export { db };
