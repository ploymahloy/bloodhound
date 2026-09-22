/// <reference types="google.maps" />
import { useEffect, useState } from 'react'

const loadPromises = new Map<string, Promise<void>>()
let callbackId = 0

declare global {
  interface Window {
    google?: typeof google
  }
}

function loadScript(apiKey: string): Promise<void> {
  const existing = loadPromises.get(apiKey)
  if (existing) return existing

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'))
      return
    }
    const id = ++callbackId
    const callbackName = `__googleMapsLoaded_${id}`
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=${callbackName}`
    script.async = true

    const fail = (err: Error) => {
      script.remove()
      delete (window as unknown as Record<string, unknown>)[callbackName]
      reject(err)
    }

    ;(window as unknown as Record<string, () => void>)[callbackName] = async () => {
      try {
        const g = window.google
        if (!g?.maps?.importLibrary) {
          fail(new Error('Google Maps API not available'))
          return
        }
        await g.maps.importLibrary('places')
        await g.maps.importLibrary('geocoding')
        delete (window as unknown as Record<string, unknown>)[callbackName]
        resolve()
      } catch (err) {
        fail(err instanceof Error ? err : new Error(String(err)))
      }
    }

    script.onerror = () => fail(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })

  loadPromises.set(apiKey, promise)
  return promise
}

export function useGoogleMapsScript(apiKey: string | undefined) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (!apiKey?.trim()) {
      setLoaded(false)
      setError(new Error('Google Maps API key is missing'))
      return
    }
    setError(undefined)
    let cancelled = false
    loadScript(apiKey)
      .then(() => {
        if (!cancelled) setLoaded(true)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })
    return () => {
      cancelled = true
    }
  }, [apiKey])

  return { loaded, error }
}
