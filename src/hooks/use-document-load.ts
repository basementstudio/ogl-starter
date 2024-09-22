"use client"

import { useEffect, useState } from "react"

import { subscribable } from "~/lib/subscribable"

const callbacks = subscribable()

export const useDocumentLoad = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof document === "undefined") return

    if (document.readyState === "complete") {
      setLoaded(true)
    } else {
      const loadCb = () => {
        if (document.readyState === "complete") {
          setLoaded(true)
        }
      }

      document.addEventListener("readystatechange", loadCb)

      return () => {
        document.removeEventListener("readystatechange", loadCb)
      }
    }
  }, [])

  useEffect(() => {
    if (!loaded) return

    /* Run all already added */
    callbacks.getCallbacks().map((callback: () => void) => {
      callback()
      callbacks.removeCallback(callback)
    })

    /* Run all the following ones */
    const cb = (id: string) => {
      callbacks.getCallback(id)()
      callbacks.removeCallback(id)
    }

    callbacks.emitter.on("add", cb)

    return () => {
      callbacks.emitter.off("add", cb)
    }
  }, [loaded])
}

export const useDocumentLoadCallback = (
  _callback: () => void | (() => void),
  args: any[] = []
) => {
  useEffect(() => {
    let cbClearFn: (() => void) | undefined

    const callbackWrapper = () => {
      cbClearFn = _callback() ?? undefined
    }

    const id = callbacks.addCallback(callbackWrapper)

    return () => {
      callbacks.removeCallback(id)
      cbClearFn?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, args)
}

export const useDocumentReady = () => {
  const [ready, setReady] = useState(false)

  useDocumentLoadCallback(() => {
    setReady(true)
  }, [])

  return ready
}
