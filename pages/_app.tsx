import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import initFirebase from "../utils/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initFirebase();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
