import admin from "firebase-admin";
import serviceAccount from "../firebase/chai-ai-e2041-firebase-adminsdk-fbsvc-344079e4b1.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
