import type { GetServerSideProps } from "next";
import Head from "next/head";
import ColorPicker from "../components/ColorPicker";
import { getDatabase, get, ref } from "firebase/database";
import { initFirebase } from "../components/FirebaseContext";
import useColor, { Color } from "../components/ColorContext";
import { useEffect } from "react";

const Home = ({ color: initialColor }: { color: Color }) => {
  const { color, setColor } = useColor();
  useEffect(() => {
    document.body.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }, [color]);
  useEffect(() => {
    setColor(initialColor);
  }, []);
  const perceivedColor = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  return (
    <div className="min-h-screen px-8">
      <Head>
        <title>Maggie's Lights 🚥</title>
        <meta name="description" content="Maggie's Lights 🚥" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <div className="flex-col md:flex-row flex justify-center gap-8 items-center h-screen">
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
  return {
    props: {
      color,
    },
  };
};
