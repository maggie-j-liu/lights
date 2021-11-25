import type { GetServerSideProps } from "next";
import Head from "next/head";
import ColorPicker, { Color } from "../components/ColorPicker";
import { getDatabase, get, ref } from "firebase/database";
import { initFirebase } from "../components/FirebaseContext";

const Home = ({ color }: { color: Color }) => {
  return (
    <div>
      <Head>
        <title>Maggie's Lights 🚥</title>
        <meta name="description" content="Maggie's Lights 🚥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        lights
        <ColorPicker initialColor={color} />
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
