import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Lathe, TorusKnot } from '@react-three/drei'
export default function Box() {
  const box = useRef<any>()
  useFrame((state, dt) => {
    if (box.current) {
      box.current.rotation.x += 0.01
      box.current.rotation.y += 0.005
    }
  })
  return (
    <Lathe scale={2} ref={box} rotation={[0.5, 0.5, 0]} position={[0, 0, -1]}>
      <meshPhongMaterial color={'red'} />
    </Lathe>
  )
}
