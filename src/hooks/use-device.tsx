import type { TierResult } from "detect-gpu"
import { useMemo } from "react"
import { useBattery } from "react-use"
import { create } from "zustand"

export interface DeviceType {
  browserName: string
  browserVersion: string
  deviceType: string
  engineName: string
  engineVersion: string
  fullBrowserVersion: string
  getUA: string
  isAndroid: boolean
  isBrowser: boolean
  isChrome: boolean
  isChromium: boolean
  isConsole: boolean
  isDesktop: boolean
  isEdge: boolean
  isEdgeChromium: boolean
  isElectron: boolean
  isEmbedded: boolean
  isFirefox: boolean
  isIE: boolean
  isIOS: boolean
  isIOS13: boolean
  isIPad13: boolean
  isIPhone13: boolean
  isIPod13: boolean
  isLegacyEdge: boolean
  isMIUI: boolean
  isMacOs: boolean
  isMobile: boolean
  isMobileOnly: boolean
  isMobileSafari: boolean
  isOpera: boolean
  isSafari: boolean
  isSamsungBrowser: boolean
  isSmartTV: boolean
  isTablet: boolean
  isWearable: boolean
  isWinPhone: boolean
  isWindows: boolean
  isYandex: boolean
  mobileModel: string
  mobileVendor: string
  osName: string
  osVersion: string
}

export interface DeviceGpu {
  gpu?: TierResult
}

export const useDevice = create<Partial<DeviceType> & DeviceGpu>(() => ({}))

const FORCE_BAKED_SHADOWS = false

export const useShouldRenderRealShadows = () => {
  const gpuTier = useDevice((s) => s.gpu?.tier)
  const isMobile = useDevice((s) => s.isMobile || s.isTablet)
  const hasLowBattery = useLowBattery()

  return useMemo(() => {
    if (FORCE_BAKED_SHADOWS) return false
    if (isMobile) return false
    if (typeof gpuTier === "undefined") return true

    return gpuTier > 1 && !hasLowBattery
  }, [gpuTier, isMobile, hasLowBattery])
}

export const useLowBattery = () => {
  const batteryState = useBattery()

  return useMemo(() => {
    if (!batteryState.isSupported) return false
    if (!batteryState.fetched) return false

    if (batteryState.level < 0.1) return true
    if (!batteryState.charging && batteryState.level < 0.3) return true

    return false
  }, [batteryState])
}
