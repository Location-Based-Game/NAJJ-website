import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.database();

export { admin, db };

export type Reference = admin.database.Reference