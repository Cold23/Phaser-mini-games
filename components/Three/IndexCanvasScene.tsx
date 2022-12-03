import {
  CameraShake,
  Plane,
  ShakeController,
  Stage,
  Text,
  useCamera,
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Box from './Box'
function IndexCanvasScene() {
  const ref = useRef<THREE.Mesh>()
  const shakeController = useRef<ShakeController>()
  const camera = useThree((state) => state.camera)
  const [text, setText] = useState('Hello!')
  useEffect(() => {
    const mouseHandle = (ev: MouseEvent) => {
      const offsetX =
        (ev.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      const offsetY =
        (ev.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      if (!ref.current) return
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        THREE.MathUtils.clamp(offsetX, -0.3, 0.3),
        0.005,
      )
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        THREE.MathUtils.clamp(offsetY, -0.3, 0.3),
        0.01,
      )
    }

    window.addEventListener('mousemove', mouseHandle)

    return () => window.removeEventListener('mousemove', mouseHandle)
  }, [])
  return (
    <Stage
      adjustCamera={false}
      intensity={0.5}
      shadows="contact"
      environment="city"
    >
      <Plane
        scale={[4, 2, 1]}
        onPointerOver={() => {
          setText('BYE!')
          shakeController.current.setIntensity(12)
          camera.translateZ(-2)
        }}
        onPointerOut={() => {
          setText('Hello!')
          camera.translateZ(2)
        }}
      >
        <meshBasicMaterial transparent={true} opacity={0} />
      </Plane>

      <Text
        ref={ref}
        position={[0, 0, 1]}
        fontSize={1}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        color="#d4d4d4"
        outlineColor={'black'}
        outlineWidth={0.005}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
      <Box />
      <CameraShake
        ref={shakeController}
        {...{
          maxYaw: 0.05, // Max amount camera can yaw in either direction
          maxPitch: 0.05, // Max amount camera can pitch in either direction
          maxRoll: 0, // Max amount camera can roll in either direction
          yawFrequency: 500, // Frequency of the the yaw rotation
          pitchFrequency: 500, // Frequency of the pitch rotation
          rollFrequency: 500, // Frequency of the roll rotation
          intensity: 0, // initial intensity of the shake
          decay: true, // should the intensity decay over time
          decayRate: 5, // if decay = true this is the rate at which intensity will reduce at
        }}
      />
    </Stage>
  )
}

export default IndexCanvasScene
