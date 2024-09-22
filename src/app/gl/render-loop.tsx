import { useEffect, useMemo } from "react"
import { useFrame, useOGL } from "react-ogl"

import { DEFAULT_SCISSOR } from "~/gl"
import { useAppControls } from "~/gl/hooks/use-app-controls"
import { useShadowRenderer } from "~/gl/hooks/use-shadow-renderer"

import { orbitCamera } from "./components/devex/orbit"

export const RenderLoop = () => {
  const setOGL = useOGL((s) => s.set)
  const scene = useOGL((s) => s.scene)
  const renderer = useOGL((s) => s.renderer)

  const activeCamera = useAppControls((s) => s.activeCamera)
  const hasRendered = useAppControls((s) => s.hasRendered)
  const setHasRendered = useAppControls((s) => s.setHasRendered)
  const glBackground = useAppControls((s) => s.glBackground)

  const mainCamera = useOGL((s) => s.camera)
  const shadowCamera = useShadowRenderer((s) => s.light)

  const cameraToRender = useMemo(() => {
    if (activeCamera === "shadow") {
      return shadowCamera
    }
    if (activeCamera === "orbit") {
      return orbitCamera
    }

    return mainCamera
  }, [activeCamera, shadowCamera, mainCamera])

  useEffect(() => {
    // disable default render loop
    setOGL(() => ({
      priority: 1
    }))
    return () => {
      setOGL(() => ({
        priority: 0
      }))
    }
  }, [setOGL])

  useFrame(() => {
    renderer.gl.scissor(
      DEFAULT_SCISSOR.x,
      DEFAULT_SCISSOR.y,
      DEFAULT_SCISSOR.width,
      DEFAULT_SCISSOR.height
    )

    /* Set clear color */
    renderer.gl.clearColor(glBackground.r, glBackground.g, glBackground.b, 1)

    renderer.render({
      scene,
      camera: cameraToRender
    })

    if (!hasRendered) {
      setHasRendered()
    }
  })

  return <></>
}
