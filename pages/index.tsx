import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';

const Home: NextPage = () => {
  const [color, setColor] = useState("#aabbcc")
  return (
    <div>
      <Head>
        <title>Maggie's Lights 🚥</title>
        <meta name="description" content="Maggie's Lights 🚥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        lights
      </main>
    </div>
  )
}

export default Home
