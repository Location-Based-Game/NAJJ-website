import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmioesrUEE9wemAZt1JjwSrCtFslexjXg",
  authDomain: "speeed-499f4.firebaseapp.com",
  projectId: "speeed-499f4",
  storageBucket: "speeed-499f4.appspot.com",
  messagingSenderId: "351192408520",
  appId: "1:351192408520:web:a4fb64552b1dead12aa0fd",
  measurementId: "G-VHDTY8QHQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)