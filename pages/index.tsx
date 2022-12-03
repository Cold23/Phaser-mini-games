/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Link from 'next/link'

import IndexCanvas from '../components/Three/IndexCanvas'

const Home = () => {
  return (
    <div>
      <Head>
        <title>Envans</title>
        <link rel="icon" href="favicon.ico?" />
      </Head>
      <div className="w-full h-screen">
        <IndexCanvas />
      </div>
      {/* HTML GAME Section */}
      <div className="py-2 px-6">
        <p className="text-2xl font-bold ">Html Games</p>
      </div>
      <div className=" sm:flex-col px-6 py-2 flex flex-row flex-nowrap justify-evenly items-center w-full h-auto gap-6">
        <Link href={'/soccer'}>
          <div className="appearance-none  group max-w-xl cursor-pointer hover:shadow-xl transition-all rounded-md shadow-lg w-full h-96 bg-white flex   overflow-hidden flex-col">
            <div className="overflow-hidden h-[80%] w-full">
              <img
                src="assets/soccer_thumbnail.png"
                className="group-hover:scale-110 transition-all scale-105 duration-300  object-cover object-top"
                alt="soccer game"
              />
            </div>
            <article className="px-2">
              <b className="text-gray-800">Soccer game</b>
              <p className="text-gray-800">Multi play with stangers</p>
            </article>
          </div>
        </Link>
        <Link href={'/stacker'}>
          <div className="group max-w-xl cursor-pointer hover:shadow-xl transition-all rounded-md shadow-lg w-full h-96 bg-white flex   overflow-hidden flex-col">
            <div className="overflow-hidden h-[80%] w-full">
              <img
                src="assets/soccer_thumbnail.png"
                className="group-hover:scale-110 transition-all scale-105 duration-300  object-cover object-top"
                alt="soccer game"
              />
            </div>
            <article className="px-2 ">
              <b className="text-gray-800">Stacking game</b>
              <p className="text-gray-800">High score</p>
            </article>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
