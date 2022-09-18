import Head from 'next/head'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'


const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/Scenes/phaserIndex'),
  { ssr: false }
)


const Home = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
  }, []);

  return (
    <div>
      <Head>
        <title>Envans</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div key={Math.random()} id="game" style={{
        width: '100%',
        height: '100%',
        fontFamily: 'pixelfont',
        backgroundColor: 'white'
      }}></div>
      {loading ? <DynamicComponentWithNoSSR /> : null}
    </div>
  );
}

export default Home;

