"use client"

import clsx from "clsx"

import { useAppStore } from "~/context/use-app-store"
import { WebGL } from "~/gl/tunnel"

import { GLOBAL_GL, GLOBAL_RENDERER, MAIN_CAMERA } from ".."
import { BasementCanvas } from "../canvas"
import { useGlControls } from "../hooks/use-gl-controls"
import { RenderLoop } from "../render-loop"
import { DebugStateMessages } from "./devex/debug-messages"
import { Helpers } from "./devex/helpers"

/** Canvas with main scene */
const PageCanvas = () => {
  const { hasRendered, activeCamera } = useGlControls()
  const isDebug = useAppStore((s) => s.isDebug)

  return (
    <div
      id="canvas-container"
      className={clsx(
        "fixed top-0 left-0 w-full h-screen z-canvas transition-opacity duration-500",
        /* Opacity 0 until we render the first frame to prevent canvas flicker on start-up */
        hasRendered ? "opacity-100" : "opacity-0",
        activeCamera === "debug-orbit" && "!z-debug-canvas"
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
          /** TODO: add a custom event manager */
        >
          <primitive
            dispose={null}
            object={MAIN_CAMERA}
            position={[0, 0, 6.3]}
          />

          <RenderLoop />

          <WebGL.Out />

          {isDebug && <Helpers />}
        </BasementCanvas>
      </div>
    </div>
  )
}

export default PageCanvas
