/// <reference types="google.maps" />

export interface GeocodeResult {
  lat: number
  lng: number
}

/**
 * Converts a location string (address, city, etc.) to latitude/longitude using
 * Google's Geocoder. Assumes the Maps script is already loaded (e.g. after
 * useGoogleMapsScript reports loaded).
 *
 * @param address - Location string to geocode (e.g. "Austin, TX", full address).
 * @returns Coordinates or null if no results or on error.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (typeof window === 'undefined' || typeof google === 'undefined') {
    return null
  }
  try {
    const { Geocoder } = (await google.maps.importLibrary(
      'geocoding'
    )) as google.maps.GeocodingLibrary
    const geocoder = new Geocoder()
    const result = await geocoder.geocode({ address: address.trim() })
    const first = result.results?.[0]
    if (!first?.geometry?.location) return null
    const location = first.geometry.location
    const lat: number =
      typeof (location as google.maps.LatLng).lat === 'function'
        ? (location as google.maps.LatLng).lat()
        : (location as unknown as { lat: number }).lat
    const lng: number =
      typeof (location as google.maps.LatLng).lng === 'function'
        ? (location as google.maps.LatLng).lng()
        : (location as unknown as { lng: number }).lng
    return { lat, lng }
  } catch {
    return null
  }
}
