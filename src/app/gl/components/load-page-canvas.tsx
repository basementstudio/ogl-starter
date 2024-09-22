"use client"

import { importAfterInteractive } from "~/components/dynamic"

export const LoadPageCanvas = importAfterInteractive(
  () => import("./page-canvas")
)
