import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { eventsStore } from '../src/globals'
import Link from 'next/link'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/Scenes/phaserIndex'),
  { ssr: false },
)

const Home = () => {
  return (
    <div>
      <Head>
        <title>Envans</title>
        <link rel="icon" href="favicon.ico?" />
      </Head>

      <div className="sm:flex-col px-6 py-2 flex flex-row flex-nowrap justify-evenly items-center w-full h-auto gap-6">
        <Link href={'/soccer'}>
          <div className="max-w-xl hover:text-lg cursor-pointer hover:drop-shadow-xl transition-all rounded-md drop-shadow-lg w-full h-96 bg-white flex justify-center items-center">
            SOCCER
          </div>
        </Link>
        <div className="max-w-xl cursor-pointer hover:text-lg hover:drop-shadow-xl transition-all rounded-md drop-shadow-lg w-full h-96 bg-white flex justify-center items-center">
          ??
        </div>
      </div>
    </div>
  )
}

export default Home
