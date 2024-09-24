import { nanoid } from "nanoid"

export interface Subscribable<T extends Function = () => void> {
  addCallback: (callback: T, id?: string) => string
  removeCallback: (id: string | T) => void
  getCallbacks: () => T[]
  getCallback: (id: string) => T
  getCallbackIds: () => string[]
  clearCallbacks: () => void
  runCallbacks: T
}

export const subscribable = <
  T extends Function = () => void
>(): Subscribable<T> => {
  const callbacks: Record<string, T> = {}

  const addCallback = (callback: T, id: string): string => {
    const _id = id || nanoid(4)
    callbacks[_id] = callback
    return _id
  }

  const removeCallback = (id: string | Function): void => {
    if (typeof id === "function") {
      const key = Object.keys(callbacks).find((k) => callbacks[k] === id)
      if (key) delete callbacks[key]
      return
    }

    delete callbacks[id]
  }

  const getCallbacks = (): T[] => Object.values(callbacks)

  const getCallback = (id: string): T => callbacks[id]

  const clearCallbacks = (): void => {
    Object.keys(callbacks).forEach((id) => {
      removeCallback(id)
    })
  }

  const runCallbacks = (...params: unknown[]): void => {
    let response = undefined as any
    Object.values(callbacks).forEach((callback) => {
      response = callback(...params)
    })
    return response
  }

  return {
    addCallback,
    removeCallback,
    getCallback,
    getCallbacks,
    getCallbackIds: () => Object.keys(callbacks),
    clearCallbacks,
    runCallbacks: runCallbacks as unknown as T
  } as Subscribable<T>
}
