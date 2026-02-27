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
    const geocoder = new google.maps.Geocoder()
    const result = await geocoder.geocode({ address: address.trim() })
    const first = result.results?.[0]
    if (!first?.geometry?.location) return null

    const location = first.geometry.location
    const lat = isLatLng(location) ? location.lat() : (location as unknown as { lat: number }).lat
    const lng = isLatLng(location) ? location.lng() : (location as unknown as { lng: number }).lng

    return { lat, lng }
  } catch {
    return null
  }
}

function isLatLng(
  value: google.maps.LatLng | { lat: () => number; lng: () => number }
): value is google.maps.LatLng {
  return value instanceof google.maps.LatLng
}