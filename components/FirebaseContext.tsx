import { FirebaseApp, initializeApp, getApps } from "firebase/app";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

const FirebaseContext = createContext<FirebaseApp | null>(null);
export const FirebaseContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  useEffect(() => {
    setFirebaseApp(initFirebase());
  }, []);
  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  );
};
const useFirebase = () => useContext(FirebaseContext);
export default useFirebase;

export const initFirebase = () => {
  const apps = getApps();
  if (!apps.length) {
    return initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return apps[0];
};
