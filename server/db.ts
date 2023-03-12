import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
