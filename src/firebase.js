// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKFlLil4_yvpS8ocVgFA3ApN-6iKxHPSw",
  authDomain: "ucdsummerproject.firebaseapp.com",
  projectId: "ucdsummerproject",
  storageBucket: "ucdsummerproject.appspot.com",
  messagingSenderId: "676041294527",
  appId: "1:676041294527:web:a2db72965b6bc06600bc0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app