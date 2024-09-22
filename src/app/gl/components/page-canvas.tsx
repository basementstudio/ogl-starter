"use client"

import clsx from "clsx"
import * as OGL from "ogl"
import { useRef, useState } from "react"
import { useFrame } from "react-ogl"

import { WebGL } from "~/gl/tunnel"

import { GLOBAL_GL, GLOBAL_RENDERER, MAIN_CAMERA } from ".."
import { BasementCanvas } from "../canvas"
import { useAppControls } from "../hooks/use-app-controls"
import { RenderLoop } from "../render-loop"
import { DebugStateMessages } from "./devex/debug-messages"
import { Helpers } from "./devex/helpers"

const hotpink = new OGL.Color(0xfba2d4)
const orange = new OGL.Color(0xf5ce54)

const Box = (props: JSX.IntrinsicElements["mesh"]) => {
  const mesh = useRef<OGL.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  useFrame(() => (mesh.current.rotation.x += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive((value) => !value)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <box />
      <program
        vertex={`
          attribute vec3 position;
          attribute vec3 normal;

          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          uniform mat3 normalMatrix;

          varying vec3 vNormal;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragment={`
          precision highp float;

          uniform vec3 uColor;
          varying vec3 vNormal;

          void main() {
            vec3 normal = normalize(vNormal);
            float lighting = dot(normal, normalize(vec3(10)));

            gl_FragColor.rgb = uColor + lighting * 0.1;
            gl_FragColor.a = 1.0;
          }
        `}
        uniforms={{ uColor: hovered ? hotpink : orange }}
      />
    </mesh>
  )
}

/** Canvas with main scene */
const PageCanvas = () => {
  const { isDebug, multiplyCanvas, hasRendered, activeCamera } =
    useAppControls()

  return (
    <div
      id="canvas-container"
      className={clsx(
        "fixed top-0 left-0 w-full h-screen z-canvas opacity-0",
        multiplyCanvas && "pointer-events-none",
        /* Opacity 0 until we render the first frame to prevent canvas flicker on start-up */
        hasRendered ? "opacity-100" : "opacity-0",
        (activeCamera === "orbit" || activeCamera === "shadow") &&
          "!z-debug-canvas"
      )}
    >
      {isDebug && (
        <>
          {/* Debug State */}
          <DebugStateMessages messages={["Debug Mode"]} />
        </>
      )}
      <div className="w-full h-full">
        <BasementCanvas
          camera={MAIN_CAMERA}
          frameloop="always"
          gl={GLOBAL_GL}
          renderer={GLOBAL_RENDERER}
        >
          <primitive
            dispose={null}
            object={MAIN_CAMERA}
            position={[0, 0, 6.3]}
          />

          <Box />

          <RenderLoop />

          <WebGL.Out />

          {isDebug && <Helpers />}
        </BasementCanvas>
      </div>
    </div>
  )
}

export default PageCanvas
