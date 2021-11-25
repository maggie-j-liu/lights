import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FirebaseContextProvider } from "../components/FirebaseContext";
import { ColorContextProvider } from "../components/ColorContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseContextProvider>
      <ColorContextProvider>
        <Component {...pageProps} />
      </ColorContextProvider>
    </FirebaseContextProvider>
  );
}

export default MyApp;
