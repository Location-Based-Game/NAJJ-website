import "server-only";
import serviceAccount from "../../skraggle-2e19f-firebase-adminsdk-ss9c5-9d01ff3f27.json";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://skraggle-2e19f-default-rtdb.firebaseio.com",
  });

  if (process.env.NODE_ENV === "development") {
    admin.database().useEmulator('localhost', 9000)
  }
}

const db = admin.database();

export { admin, db };

export type Reference = admin.database.Reference