import { useEffect, useState } from 'react'

const loadPromises = new Map<string, Promise<void>>()

function loadScript(apiKey: string): Promise<void> {
  const existing = loadPromises.get(apiKey)
  if (existing) return existing

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'))
      return
    }
    const callbackName = `__googleMapsLoaded_${apiKey.slice(-8)}`
    ;(window as unknown as Record<string, () => void>)[callbackName] = async () => {
      try {
        const g = (window as unknown as { google?: { maps: { importLibrary: (name: string) => Promise<unknown> } } }).google
        if (!g?.maps?.importLibrary) {
          reject(new Error('Google Maps API not available'))
          return
        }
        await g.maps.importLibrary('places')
        resolve()
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)))
      }
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=${callbackName}`
    script.async = true
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
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
      setError(new Error('Google Maps API key is missing'))
      return
    }
    setError(undefined)
    loadScript(apiKey)
      .then(() => setLoaded(true))
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
  }, [apiKey])

  return { loaded, error }
}
