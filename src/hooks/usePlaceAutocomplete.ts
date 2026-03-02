/// <reference types="google.maps" />
import { type RefObject, useEffect, useRef } from 'react'
import {
  type GmpSelectEventDetail,
  extractLatLngFromPlaceLocation,
  setPlaceholderIfSupported,
  setValueIfSupported,
} from '../utils/placeAutocomplete'

export interface PlaceSelectData {
  addressText: string
  location: { lat: number; lng: number } | null
}

export interface UsePlaceAutocompleteOptions {
  onPlaceSelect: (data: PlaceSelectData) => void
  /** Pre-fill the search bar with this text (e.g. current location). */
  initialValue?: string
}

export function usePlaceAutocomplete(
  containerRef: RefObject<HTMLDivElement | null>,
  mapsLoaded: boolean,
  options: UsePlaceAutocompleteOptions
): void {
  const { onPlaceSelect, initialValue } = options
  const onPlaceSelectRef = useRef(onPlaceSelect)
  onPlaceSelectRef.current = onPlaceSelect

  useEffect(() => {
    if (!mapsLoaded || !containerRef.current || typeof google === 'undefined') return
    const container = containerRef.current
    const { PlaceAutocompleteElement } = google.maps.places
    const autocomplete = new PlaceAutocompleteElement({})
    setPlaceholderIfSupported(autocomplete, 'Enter city, neighborhood, or address')

    const handleSelect = async (e: Event) => {
      const ev: GmpSelectEventDetail =
        (e as CustomEvent<GmpSelectEventDetail>).detail ?? (e as unknown as GmpSelectEventDetail)
      if (!ev?.placePrediction) return
      const place = await Promise.resolve(ev.placePrediction.toPlace())
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      })
      const addressText = place.formattedAddress ?? place.displayName ?? ''
      const coordinates = extractLatLngFromPlaceLocation(place.location)
      onPlaceSelectRef.current({ addressText, location: coordinates })
      console.log('Address: ', place.displayName)
      console.log('Coordinates: ', coordinates)
    }

    autocomplete.addEventListener('gmp-select', handleSelect)
    container.appendChild(autocomplete)
    if (initialValue?.trim()) {
      const value = initialValue.trim()
      requestAnimationFrame(() => setValueIfSupported(autocomplete, value))
    }
    return () => {
      autocomplete.removeEventListener('gmp-select', handleSelect)
      autocomplete.remove()
    }
  }, [mapsLoaded, containerRef, initialValue])
}
