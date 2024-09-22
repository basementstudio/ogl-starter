import { create } from "zustand"

// Extend this store if you need!

export interface AppStore {
  fontsLoaded: boolean
  highPriorityAnimationRunning: boolean
  reducedMotion: boolean
  setFontsLoaded: (fontsLoaded: boolean) => void
  setHighPriorityAnimationRunning: (
    highPriorityAnimationRunning: boolean
  ) => void
  setReducedMotion: (reducedMotion: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  fontsLoaded: false,
  highPriorityAnimationRunning: false,
  reducedMotion: false,
  setFontsLoaded: (fontsLoaded: boolean) => set((s) => ({ ...s, fontsLoaded })),
  setHighPriorityAnimationRunning: (highPriorityAnimationRunning: boolean) =>
    set((s) => ({ ...s, highPriorityAnimationRunning })),
  setReducedMotion: (reducedMotion: boolean) =>
    set((s) => ({ ...s, reducedMotion }))
}))
