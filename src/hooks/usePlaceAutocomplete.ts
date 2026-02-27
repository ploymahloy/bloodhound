/// <reference types="google.maps" />
import { type RefObject, useEffect, useRef } from 'react'
import {
  type GmpSelectEventDetail,
  extractLatLngFromPlaceLocation,
  setPlaceholderIfSupported,
} from '../utils/placeAutocomplete'

export interface PlaceSelectData {
  addressText: string
  location: { lat: number; lng: number } | null
}

export function usePlaceAutocomplete(
  containerRef: RefObject<HTMLDivElement | null>,
  mapsLoaded: boolean,
  options: { onPlaceSelect: (data: PlaceSelectData) => void }
): void {
  const { onPlaceSelect } = options
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
    return () => {
      autocomplete.removeEventListener('gmp-select', handleSelect)
      autocomplete.remove()
    }
  }, [mapsLoaded, containerRef])
}
