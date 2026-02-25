import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button, Input } from '../components'
import './Landing.css'

const HERO_CATEGORIES = [
  'Bandmates. ',
  'Mixing Engineers. ',
  'Venues. ',
  'Gear Rental. ',
] as const

function Landing() {
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
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
            <Input
              type="text"
              name="location"
              className="landing-search-input"
              placeholder="Enter city, neighborhood, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            />
            <Button type="submit" className="landing-search-btn" variant="ghost" aria-label="Search">
              <Search size={20} aria-hidden />
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Landing
