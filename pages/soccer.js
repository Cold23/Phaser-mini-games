import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { eventsStore } from '../src/globals'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/Scenes/phaserIndex'),
  { ssr: false },
)

const Soccer = () => {
  const [hydrated, setHydrated] = useState(false)
  const eventManager = eventsStore((state) => state.eventManager)

  useEffect(() => {
    eventManager?.emit('start', 'MiniSoccer')
    setHydrated(true)
    return () => {
      eventManager?.emit('stop', 'MiniSoccer')
    }
  }, [eventManager])

  return (
    <div>
      <Head>
        <title>Envans</title>
        <link rel="icon" href="favicon.ico?" />
      </Head>

      <div
        key={'game'}
        id="game"
        style={{
          width: '100%',
          height: '100%',
          fontFamily: 'pixelfont',
          backgroundColor: 'white',
        }}
      ></div>
      {hydrated ? <DynamicComponentWithNoSSR /> : null}
    </div>
  )
}

export default Soccer
