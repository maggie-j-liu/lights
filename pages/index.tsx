import type { GetServerSideProps } from "next";
import Head from "next/head";
import ColorPicker from "../components/ColorPicker";
import initFirebase from "../utils/firebase";
import { getDatabase, get, ref } from "firebase/database";

interface FirebaseColor {
  red: number;
  green: number;
  blue: number;
}
const Home = ({ color }: { color: FirebaseColor }) => {
  return (
    <div>
      <Head>
        <title>Maggie's Lights 🚥</title>
        <meta name="description" content="Maggie's Lights 🚥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        lights
        <ColorPicker
          initialColor={{ r: color.red, g: color.green, b: color.blue }}
        />
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
