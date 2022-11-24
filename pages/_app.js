import { Fragment } from 'react'
import Header from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col">
      <div className="h-[68px] w-full">
        <Header />
      </div>
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
