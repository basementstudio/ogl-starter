import { nanoid } from "nanoid"
import { TinyEmitter } from "tiny-emitter"

export interface Subscribable<T extends Function = () => void> {
  addCallback: (callback: T, id?: string) => string
  removeCallback: (id: string | Function) => void
  getCallbacks: () => T[]
  getCallback: (id: string) => T
  getCallbackIds: () => string[]
  clearCallbacks: () => void
  emitter: TinyEmitter
}

export const subscribable = <T extends Function = () => void>() => {
  const callbacks: Record<string, T> = {}
  const emitter = new TinyEmitter()

  const addCallback = (callback: T, id: string) => {
    const _id = id || nanoid(4)
    callbacks[_id] = callback
    emitter.emit("add", _id)
    return _id
  }

  const removeCallback = (id: string | Function) => {
    if (typeof id === "function") {
      const key = Object.keys(callbacks).find((key) => callbacks[key] === id)
      if (key) delete callbacks[key]
      return
    }

    delete callbacks[id]

    emitter.emit("remove", id)
  }

  const getCallbacks = () => Object.values(callbacks)

  const getCallback = (id: string) => callbacks[id]

  const clearCallbacks = () => {
    Object.keys(callbacks).forEach((id) => {
      removeCallback(id)
    })
  }

  return {
    addCallback,
    removeCallback,
    getCallback,
    getCallbacks,
    getCallbackIds: () => Object.keys(callbacks),
    clearCallbacks,
    emitter
  } as Subscribable<T>
}
