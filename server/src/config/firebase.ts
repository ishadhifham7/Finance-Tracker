import * as admin from "firebase-admin";
import path from "path";

// The path to your service account key from the .env
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "";

admin.initializeApp({
  credential: admin.credential.cert(path.resolve(serviceAccountPath)),
});

export const auth = admin.auth();
