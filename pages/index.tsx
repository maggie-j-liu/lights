import type { GetServerSideProps } from "next";
import Head from "next/head";
import ColorPicker from "../components/ColorPicker";
import { getDatabase, get, ref, onValue } from "firebase/database";
import useFirebase, { initFirebase } from "../components/FirebaseContext";
import useColor, { AllColors, Color } from "../components/ColorContext";
import { useEffect, useState } from "react";

const Home = ({
  color: initialColor,
  on,
}: {
  color: AllColors;
  on: boolean;
}) => {
  const { color, setColor } = useColor();
  const [status, setStatus] = useState(on);
  const firebaseApp = useFirebase();
  useEffect(() => {
    document.body.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }, [color]);
  useEffect(() => {
    if (!firebaseApp) return;
    const unsubscribe = onValue(ref(getDatabase(), "on"), (snapshot) => {
      setStatus(snapshot.val());
    });
    return () => unsubscribe();
  }, [firebaseApp]);
  useEffect(() => {
    setColor(initialColor);
  }, []);
  const perceivedColor = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  return (
    <div className="min-h-screen">
      <Head>
        <title>Maggie's Lights 🚥</title>
        <meta name="description" content="Maggie's Lights 🚥" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <div className="py-16 px-8 flex-col md:flex-row flex justify-center gap-8 items-center h-screen">
          <ColorPicker />
          <div
            className="max-w-sm lg:max-w-md order-first md:order-2 text-center md:text-left"
            style={{ color: perceivedColor > 127.5 ? "black" : "white" }}
          >
            <h1 className="text-5xl mb-2 font-light">lights 🚥</h1>
            <p className="text-2xl">
              These are the lights in{" "}
              <a
                className="underline font-semibold"
                href="https://maggieliu.dev"
                target="_blank"
                rel="noreferrer"
              >
                my
              </a>{" "}
              room! Use the slider to control them. Have fun :)
            </p>
            <div className="h-8" />
            <p className="flex items-center gap-2">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`inline-block w-4 h-4 rounded-full ${
                  status ? "bg-green-500" : "bg-red-500"
                }`}
              />{" "}
              {status ? "on" : "off"}
            </p>
            <p className="text-left text-sm">
              {status
                ? "My lights are on right now! Choose a color here and they'll change!"
                : "My lights are off right now, but they'll be the color selected here when I turn them back on."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  initFirebase();
  const db = getDatabase();
  const color = await get(ref(db, "color")).then((snapshot) => snapshot.val());
  const on = await get(ref(db, "on")).then((snapshot) => snapshot.val());
  return {
    props: {
      color,
      on,
    },
  };
};
