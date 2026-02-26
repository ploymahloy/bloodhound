import { useEffect, useRef, useState } from 'react'
import { geocodeAddress } from '../utils/geocode'
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript'
import './Landing.css'

const HERO_CATEGORIES = [
  'Bandmates. ',
  'Mixing Engineers. ',
  'Venues. ',
  'Gear Rental. ',
] as const

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface GmpPlaceLike {
  fetchFields: (opts: { fields: string[] }) => Promise<void>
  formattedAddress?: string
  displayName?: string
  location?: google.maps.LatLng | { lat: number; lng: number }
}

/** Event payload for PlaceAutocompleteElement gmp-select. */
interface GmpSelectEventDetail {
  placePrediction: {
    toPlace: () => Promise<GmpPlaceLike> | GmpPlaceLike
  }
}

function setPlaceholderIfSupported(
  element: InstanceType<typeof google.maps.places.PlaceAutocompleteElement>,
  value: string
): void {
  if ('placeholder' in element) {
    (element as { placeholder: string }).placeholder = value
  }
}

function Landing() {
  const [location, setLocation] = useState('')
  const [selectedPlaceLocation, setSelectedPlaceLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const autocompleteContainerRef = useRef<HTMLDivElement>(null)
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMapsScript(googleMapsApiKey)

  useEffect(() => {
    if (!mapsLoaded || !autocompleteContainerRef.current || typeof google === 'undefined') return
    const container = autocompleteContainerRef.current
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
      const text = place.formattedAddress ?? place.displayName ?? ''
      if (text) setLocation(text)
      const loc = place.location
      if (loc) {
        const lat = typeof (loc as google.maps.LatLng).lat === 'function' ? (loc as google.maps.LatLng).lat() : (loc as { lat: number }).lat
        const lng = typeof (loc as google.maps.LatLng).lng === 'function' ? (loc as google.maps.LatLng).lng() : (loc as { lng: number }).lng
        setSelectedPlaceLocation({ lat, lng })
      } else {
        setSelectedPlaceLocation(null)
      }
    }
    autocomplete.addEventListener('gmp-select', handleSelect)
    container.appendChild(autocomplete)
    return () => {
      autocomplete.removeEventListener('gmp-select', handleSelect)
      autocomplete.remove()
    }
  }, [mapsLoaded])

  const handleSearch = async (e: React.FormEvent) => {
    console.log('search triggered')
    e.preventDefault()
    if (!location.trim()) return
    const coords =
      selectedPlaceLocation ?? (await geocodeAddress(location.trim()))
    if (coords) {
      console.log('Location coordinates:', { lat: coords.lat, lng: coords.lng })
    }
  }

  return (
    <div className="landing-page">
      <main className="landing-main">
        <div className="landing-hero">
          <h1 className="landing-hero-title">
            {HERO_CATEGORIES.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </h1>
          <form
            className="landing-search"
            onSubmit={handleSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.requestSubmit()
              }
            }}
            role="search"
            aria-label="Search by location"
          >
            <div
              ref={autocompleteContainerRef}
              className="landing-search-input"
              aria-label="Location"
            >
              {mapsError && (
                <div
                  className="landing-search-error"
                  role="alert"
                  aria-live="polite"
                >
                  <p>Couldn&apos;t load location search.</p>
                  <button
                    type="button"
                    className="landing-search-retry"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              )}
              {!mapsLoaded && !mapsError && (
                <div
                  className="landing-search-loading"
                  aria-busy="true"
                  aria-label="Loading location search"
                >
                  Loading location search…
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Landing
