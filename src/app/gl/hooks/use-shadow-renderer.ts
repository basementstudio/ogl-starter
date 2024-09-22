"use client"

import {
  Camera,
  OGLRenderingContext,
  Renderer,
  RenderTarget,
  Transform
} from "ogl"
import { create } from "zustand"

import { valueRemap } from "~/lib/utils/math"

import { GLOBAL_GL, GLOBAL_RENDERER } from ".."
import { Shadow } from "../extras/shadow"

export interface ShadowRendererStore {
  renderer: Renderer
  gl: OGLRenderingContext
  /** Scene that will be rendered into shadow */
  shadowScene: Transform
  /** Raw shadow render target */
  shadowFbo: RenderTarget
  /** Sun */
  light: Camera
  /** The shadow renderer */
  shadowRenderer: Shadow
  /** Contains a simple plane and camera to burn the shadow */
  shadowBurnerScene: Transform
  /** Fbo where the shadow result will be stored */
  shadowBurnerFbo: RenderTarget
  /** Camera size of shadow baker */
  shadowBurnerCameraSize: number
  /** Camera of shadow bake */
  shadowBurnerCamera: Camera
  /** Ref day progress */
  dayProgress: { current: number }
  aspect: number
  setAspect: (aspect: number) => void
}

export const useShadowRenderer = create<ShadowRendererStore>((set) => {
  const gl = GLOBAL_GL
  if (!gl) return {} as any

  const shadowTextureSize = 1024

  // The scene thats render the 3D shadow
  const shadowScene = new Transform()
  const shadowFbo = new RenderTarget(gl, {
    width: shadowTextureSize,
    height: shadowTextureSize,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR
  })
  const lightScale = 8
  const light = new Camera(gl, {
    top: lightScale,
    bottom: -lightScale,
    left: -lightScale,
    right: lightScale,
    near: 5,
    far: 32
  })
  const shadowRenderer = new Shadow(gl, {
    light: light,
    target: shadowFbo
  })

  // Shadow burner is a small scene that renders the shadows into a texture
  const shadowBurnerScene = new Transform()
  const shadowBurnerFbo = new RenderTarget(gl, {
    width: shadowTextureSize,
    height: shadowTextureSize,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR
  })

  const shadowBurnerCameraSize = 5
  const shadowBurnerCamera = new Camera(gl, {
    top: shadowBurnerCameraSize,
    bottom: -shadowBurnerCameraSize,
    left: -shadowBurnerCameraSize,
    right: shadowBurnerCameraSize,
    near: 1,
    far: 32
  })

  shadowBurnerCamera.position.set(0, 0, 2)

  const setAspect = (aspect: number) => {
    const xScaler = valueRemap(aspect, 0.5, 4, 0.3, 2.2)
    const yScaler = valueRemap(aspect, 1, 5, 1, 1.3)

    light.left = -lightScale * xScaler
    light.right = lightScale * xScaler
    light.top = lightScale * yScaler
    light.bottom = -lightScale * yScaler
    light.orthographic()

    const height = shadowTextureSize
    const width = shadowTextureSize * aspect

    shadowBurnerFbo.setSize(width, height)
    shadowRenderer.setSize({ width: width, height })

    set({ aspect })
  }

  return {
    renderer: GLOBAL_RENDERER!,
    gl,
    // Shadow
    shadowScene,
    shadowFbo,
    light,
    shadowRenderer,
    dayProgress: { current: 0 },
    // Burner
    shadowBurnerScene,
    shadowBurnerFbo,
    shadowBurnerCameraSize,
    shadowBurnerCamera,
    aspect: 1,
    setAspect
  } satisfies ShadowRendererStore
})
