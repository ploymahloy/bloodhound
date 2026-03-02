import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { geocodeAddress } from '../utils/geocode'
import {
  getLocationResultsByCoordinates,
  type LocationApiError,
  type LocationSearchResponse,
} from '../services/locationApi'

export interface UseSearchResultsState {
  locationName: string | null
  loading: boolean
  error: LocationApiError | null
  data: LocationSearchResponse | null
  missingParams: boolean
  refetch: () => void
}

export function useSearchResults(mapsLoaded: boolean): UseSearchResultsState {
  const [searchParams] = useSearchParams()

  const locationParam = searchParams.get('location')
  const hasLocation = typeof locationParam === 'string' && locationParam.trim().length > 0

  const [locationName, setLocationName] = useState<string | null>(() => {
    if (hasLocation) return decodeURIComponent(locationParam!.trim())
    return null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LocationApiError | null>(null)
  const [data, setData] = useState<LocationSearchResponse | null>(null)
  const [reloadIndex, setReloadIndex] = useState(0)

  const missingParams = !hasLocation

  useEffect(() => {
    if (!hasLocation) {
      setLoading(false)
      setError(null)
      setData(null)
      setLocationName(null)
      return
    }

    if (!mapsLoaded) {
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const decoded = decodeURIComponent(locationParam!.trim())
      setLocationName(decoded)

      const coords = await geocodeAddress(decoded)
      if (cancelled) return
      if (!coords) {
        setError({
          name: 'LocationApiError',
          message: 'Could not find coordinates for that location.',
          status: 0,
          body: null,
        })
        setLoading(false)
        return
      }

      try {
        const response = await getLocationResultsByCoordinates({
          latitude: coords.lat,
          longitude: coords.lng,
        })

        if (!cancelled) {
          setData(response)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as LocationApiError)
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [hasLocation, locationParam, mapsLoaded, reloadIndex])

  const refetch = useCallback(() => {
    setReloadIndex((index) => index + 1)
  }, [])

  return {
    locationName,
    loading,
    error,
    data,
    missingParams,
    refetch,
  }
}

