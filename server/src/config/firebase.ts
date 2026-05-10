import * as admin from "firebase-admin";
import path from "path";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH is not set");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.resolve(serviceAccountPath)),
  });
}

export const auth = admin.auth();
