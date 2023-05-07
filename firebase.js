import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountKeyPath = path.resolve("serviceAccountKey.json");
const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountKeyPath, "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

export { admin, firestore };
