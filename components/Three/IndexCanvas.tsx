import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

import Box from './Box'

import EffectsController from './EffectsController'
import { Stage } from '@react-three/drei'
import IndexCanvasScene from './IndexCanvasScene'
function IndexCanvas() {
  return (
    <Canvas dpr={[1, 2]} shadows={true}>
      <Suspense fallback={null}>
        <spotLight position={[0, 0, 1]} intensity={0.5} />
        <ambientLight />
        <IndexCanvasScene />
      </Suspense>
    </Canvas>
  )
}

export default IndexCanvas
