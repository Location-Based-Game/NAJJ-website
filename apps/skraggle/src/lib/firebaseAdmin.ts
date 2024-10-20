import "server-only";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.SKRAGGLE_FIREBASE_ADMIN!)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://skraggle-2e19f-default-rtdb.firebaseio.com",
  });

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    admin.database().useEmulator('localhost', 9000)
  }
}

const db = admin.database();

export { admin, db };

export type Reference = admin.database.Reference