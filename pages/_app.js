import { Fragment } from 'react'
import Header from '../components/Header'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return <Fragment >

    <Header />
    <div className='pt-[68px]' >
      <Component {...pageProps} />
    </div>
  </Fragment>
}

export default MyApp
