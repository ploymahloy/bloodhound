import { useEffect, useRef, useState } from 'react'
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript'
import './Landing.css'

const HERO_CATEGORIES = [
  'Bandmates. ',
  'Mixing Engineers. ',
  'Venues. ',
  'Gear Rental. ',
] as const

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

function Landing() {
  const [location, setLocation] = useState('')
  const autocompleteContainerRef = useRef<HTMLDivElement>(null)
  const { loaded: mapsLoaded } = useGoogleMapsScript(googleMapsApiKey)

  useEffect(() => {
    if (!mapsLoaded || !autocompleteContainerRef.current || typeof google === 'undefined') return
    const container = autocompleteContainerRef.current
    const { PlaceAutocompleteElement } = google.maps.places
    const autocomplete = new PlaceAutocompleteElement({})
    if ('placeholder' in autocomplete) {
      (autocomplete as { placeholder: string }).placeholder =
        'Enter city, neighborhood, or address'
    }
    const handleSelect = async (e: Event) => {
      const ev = e as unknown as {
        placePrediction: {
          toPlace: () =>
            | Promise<{ fetchFields: (opts: { fields: string[] }) => Promise<void>; formattedAddress?: string; displayName?: string }>
            | { fetchFields: (opts: { fields: string[] }) => Promise<void>; formattedAddress?: string; displayName?: string };
        };
      }
      const place = await Promise.resolve(ev.placePrediction.toPlace())
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress'],
      })
      const text = place.formattedAddress ?? place.displayName ?? ''
      if (text) setLocation(text)
    }
    autocomplete.addEventListener('gmp-select', handleSelect)
    container.appendChild(autocomplete)
    return () => {
      autocomplete.removeEventListener('gmp-select', handleSelect)
      autocomplete.remove()
    }
  }, [mapsLoaded])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return
    // Placeholder: wire to search/navigation later
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
            role="search"
            aria-label="Search by location"
          >
            <div
              ref={autocompleteContainerRef}
              className="landing-search-input"
              aria-label="Location"
            />
          </form>
        </div>
      </main>
    </div>
  )
}

export default Landing
