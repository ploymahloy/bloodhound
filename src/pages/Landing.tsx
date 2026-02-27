import { useRef } from 'react'
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript'
import { usePlaceAutocomplete } from '../hooks/usePlaceAutocomplete'
import { fetchDataByCoordinates } from '../services/locationApi'
import './Landing.css'

const HERO_CATEGORIES = [
  'Bandmates. ',
  'Mixing Engineers. ',
  'Venues. ',
  'Gear Rental. ',
] as const

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function Landing() {
  const autocompleteContainerRef = useRef<HTMLDivElement>(null)
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMapsScript(googleMapsApiKey)

  usePlaceAutocomplete(autocompleteContainerRef, mapsLoaded, {
    onPlaceSelect: async ({ location: coords }) => {
      if (!coords) return
      try {
        const data = await fetchDataByCoordinates({
          latitude: coords.lat,
          longitude: coords.lng,
        })
        console.log('Data: ', data)
        // TODO: handle response (e.g. navigate, show results)
        alert('Data: ' + JSON.stringify(data))
      } catch (err) {
        console.error('Location search failed', err)
        // TODO: surface error to user via error modal
        alert('Location search failed: ' + JSON.stringify(err))
      }
    },
  })

  return (
    <div className="landing-page">
      <main className="landing-main">
        <div className="landing-hero">
          <h1 className="landing-hero-title">
            {HERO_CATEGORIES.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </h1>
          <div
            className="landing-search"
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
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
