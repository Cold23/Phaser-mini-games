import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect } from 'react'
import { useState } from 'react'
import { eventsStore } from '../src/globals'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/Scenes/phaserIndex'),
  { ssr: false },
)

const Stacker = () => {
  const [hydrated, setHydrated] = useState(false)
  const eventManager = eventsStore((state) => state.eventManager)
  useEffect(() => {
    eventManager?.emit('start', 'StackingGame')
    setHydrated(true)

    return () => {
      eventManager?.emit('stop', 'StackingGame')
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
          border: '1px solid #6a6a6a22',
        }}
      ></div>
      {hydrated ? <DynamicComponentWithNoSSR /> : null}
    </div>
  )
}

export default Stacker
