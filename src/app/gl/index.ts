"use client"

import { Camera, Renderer } from "ogl"

import { DEFAULT_CLEAR_COLOR } from "./constants"

export const GLOBAL_CANVAS = document.createElement("canvas")

GLOBAL_CANVAS.width = 0
GLOBAL_CANVAS.height = 0

export const GLOBAL_RENDERER = new Renderer({
  alpha: true,
  antialias: false,
  powerPreference: "high-performance",
  canvas: GLOBAL_CANVAS,
  width: GLOBAL_CANVAS.width,
  height: GLOBAL_CANVAS.height
})

export const DEFAULT_SCISSOR = {
  x: 0,
  y: 0,
  get width() {
    return GLOBAL_CANVAS.width * GLOBAL_RENDERER.dpr
  },
  get height() {
    return GLOBAL_CANVAS.height * GLOBAL_RENDERER.dpr
  }
}

GLOBAL_RENDERER.gl.scissor(
  DEFAULT_SCISSOR.x,
  DEFAULT_SCISSOR.y,
  DEFAULT_SCISSOR.width,
  DEFAULT_SCISSOR.height
)
GLOBAL_RENDERER.gl.enable(GLOBAL_RENDERER.gl.SCISSOR_TEST)

export const GLOBAL_GL = GLOBAL_RENDERER.gl

/* Cream */
GLOBAL_GL.clearColor(
  DEFAULT_CLEAR_COLOR.r,
  DEFAULT_CLEAR_COLOR.g,
  DEFAULT_CLEAR_COLOR.b,
  1
)

export const MAIN_CAMERA = new Camera(GLOBAL_GL, {
  fov: 75,
  aspect: GLOBAL_CANVAS.width / GLOBAL_CANVAS.height,
  far: 1000
})
