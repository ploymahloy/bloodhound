/// <reference types="google.maps" />

export interface GmpPlaceLike {
  fetchFields: (opts: { fields: string[] }) => Promise<void>
  formattedAddress?: string
  displayName?: string
  location?: google.maps.LatLng | { lat: number; lng: number }
}

/** Event payload for PlaceAutocompleteElement gmp-select. */
export interface GmpSelectEventDetail {
  placePrediction: {
    toPlace: () => Promise<GmpPlaceLike> | GmpPlaceLike
  }
}

export function setPlaceholderIfSupported(
  element: InstanceType<typeof google.maps.places.PlaceAutocompleteElement>,
  value: string
): void {
  if ('placeholder' in element) {
    (element as { placeholder: string }).placeholder = value
  }
}

/** Set the autocomplete input value (e.g. for pre-fill). Uses internal input if present. */
export function setValueIfSupported(
  element: InstanceType<typeof google.maps.places.PlaceAutocompleteElement>,
  value: string
): void {
  if (typeof (element as { value?: string }).value !== 'undefined') {
    (element as { value: string }).value = value
    return
  }
  const root = element.shadowRoot ?? element
  const input = root.querySelector?.('input')
  if (input) {
    input.value = value
  }
}

export function extractLatLngFromPlaceLocation(
  location: google.maps.LatLng | { lat: number; lng: number } | undefined
): { lat: number; lng: number } | null {
  if (!location) return null
  const lat =
    typeof (location as google.maps.LatLng).lat === 'function'
      ? (location as google.maps.LatLng).lat()
      : (location as { lat: number }).lat
  const lng =
    typeof (location as google.maps.LatLng).lng === 'function'
      ? (location as google.maps.LatLng).lng()
      : (location as { lng: number }).lng
  return { lat, lng }
}
