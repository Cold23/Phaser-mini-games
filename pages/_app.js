import { Fragment } from 'react'
import Header from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col ">
      <div className="h-[68px] w-full z-10">
        <Header />
      </div>
      <div className="z-0">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
