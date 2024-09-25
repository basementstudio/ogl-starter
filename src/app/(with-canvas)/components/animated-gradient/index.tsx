"use client"

import { Mesh, TextureLoader, Triangle, Vec2 } from "ogl"
import { useRef } from "react"
import { useFrame, useLoader, useOGL } from "react-ogl"
import { useWindowSize } from "react-use"

import {
  ANIMATED_GRADIENT_FRAGMENT,
  ANIMATED_GRADIENT_VERTEX
} from "./animated-gradient-program"

export function AnimatedGradient() {
  const meshRef = useRef<Mesh>(null)
  const { gl } = useOGL()
  const geometry = new Triangle(gl)
  const texture = useLoader(TextureLoader, "/textures/gradient.jpg")
  const windowSize = useWindowSize()

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.program.uniforms.uTime.value = delta * 0.0001
    }
  })

  return (
    <mesh ref={meshRef}>
      <program
        vertex={ANIMATED_GRADIENT_VERTEX}
        fragment={ANIMATED_GRADIENT_FRAGMENT}
        uniforms={{
          uTime: {
            value: 0
          },
          uGradient: {
            value: texture
          },
          uResolution: {
            value: new Vec2(windowSize.width, windowSize.height)
          }
        }}
      />
      <geometry {...geometry.attributes} />
    </mesh>
  )
}
