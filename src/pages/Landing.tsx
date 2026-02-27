import { useRef, useState } from 'react'
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript'
import { usePlaceAutocomplete } from '../hooks/usePlaceAutocomplete'
import './Landing.css'

const HERO_CATEGORIES = [
  'Bandmates. ',
  'Mixing Engineers. ',
  'Venues. ',
  'Gear Rental. ',
] as const

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function Landing() {
  const [location, setLocation] = useState('')
  const autocompleteContainerRef = useRef<HTMLDivElement>(null)
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMapsScript(googleMapsApiKey)

  usePlaceAutocomplete(autocompleteContainerRef, mapsLoaded, {
    onPlaceSelect: ({ addressText }) => {
      setLocation(addressText)
    },
  })

  const handleSearch = async (e: React.FormEvent) => {
    console.log('search triggered')
    e.preventDefault()
    if (!location.trim()) return
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
