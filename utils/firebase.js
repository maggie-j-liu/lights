import { initializeApp, getApps } from "firebase/app";
const initFirebase = () => {
  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
};
export default initFirebase;
