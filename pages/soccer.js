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
  const [waiting, setWaiting] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const eventManager = eventsStore((state) => state.eventManager)
  useEffect(() => {
    eventManager?.emit('start', 'MiniSoccer')
    setHydrated(true)
    eventManager?.on('ready', () => {
      setWaiting(false)
    })
    eventManager?.on('loaded', () => {
      setLoaded(true)
    })
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
          position: 'relative',
          width: '100%',
          height: '100%',
          fontFamily: 'pixelfont',
          backgroundColor: 'white',
        }}
      >
        {waiting && loaded && (
          <div className="z-10 top-0 left-0 text-white absolute flex items-center justify-center w-full h-full backdrop-brightness-50">
            Waiting for opponent...
          </div>
        )}
      </div>
      {hydrated ? <DynamicComponentWithNoSSR /> : null}
    </div>
  )
}

export default Soccer
