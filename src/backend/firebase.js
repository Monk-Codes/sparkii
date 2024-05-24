import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyBSVXCU8zcasseFyJNbZ2vdoHmx7iAIbzw",
 authDomain: "sparki-f4b83.firebaseapp.com",
 projectId: "sparki-f4b83",
 storageBucket: "sparki-f4b83.appspot.com",
 messagingSenderId: "1099284149009",
 appId: "1:1099284149009:web:8dbae95d70b3d40b3912b0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
