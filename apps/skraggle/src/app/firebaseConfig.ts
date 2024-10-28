// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth, connectAuthEmulator } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyASH4ThiERxyYYW8A_TQfLFr_aa5YjAuiY",
  authDomain: "skraggle-2e19f.firebaseapp.com",
  databaseURL: "https://skraggle-2e19f-default-rtdb.firebaseio.com",
  projectId: "skraggle-2e19f",
  storageBucket: "skraggle-2e19f.appspot.com",
  messagingSenderId: "280228149737",
  appId: "1:280228149737:web:5a40d025cac04a31ee7378",
  measurementId: "G-3VH0D32G0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app)
// export const auth = getAuth(app)

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
  connectDatabaseEmulator(rtdb, "127.0.0.1", 9000)
  // connectAuthEmulator(auth, "http://127.0.0.1:9099")
}
