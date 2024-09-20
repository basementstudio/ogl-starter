"use client"

import { Color } from "ogl"
import { create } from "zustand"

import { isClient } from "~/lib/constants"

import { DEFAULT_CLEAR_COLOR } from "../constants"

export type CameraName = "main" | "orbit" | "shadow"

export interface DebugStore {
  isDebug: boolean
  activeCamera: CameraName
  multiplyCanvas: boolean
  scrollerContainer: HTMLDivElement | null
  canvasElement: HTMLCanvasElement | null
  setActiveCamera: (camera: CameraName) => void
  aspect: number
  hasRendered: boolean
  setHasRendered: () => void
  glBackground: Color
}

export const useAppControls = create<DebugStore>((set) => {
  const state: DebugStore = {
    isDebug: false,
    activeCamera: "main",
    multiplyCanvas: true,
    scrollerContainer: null,
    canvasElement: null,
    aspect: 1,
    hasRendered: false,
    glBackground: DEFAULT_CLEAR_COLOR,
    setHasRendered: () => {
      set({ hasRendered: true })
    },
    setActiveCamera: (camera) => {
      set({ activeCamera: camera })
    }
  }

  if (!isClient) {
    return state
  }

  const url = new URL(document.location.href)

  const hasDebugParam = url.searchParams.has("debug")
  state.isDebug = hasDebugParam

  return state
})
