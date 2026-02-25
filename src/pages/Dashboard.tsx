import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button, Input } from '../components'
import './Dashboard.css'

const HERO_CATEGORIES = [
  'Bandmates. ',
  'Mixing Engineers. ',
  'Venues. ',
  'Gear Rental. ',
] as const

function Dashboard() {
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: wire to search/navigation later
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="dashboard-hero">
          <h1 className="dashboard-hero-title">
            {HERO_CATEGORIES.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </h1>
          <form
            className="dashboard-search"
            onSubmit={handleSearch}
            role="search"
            aria-label="Search by location"
          >
            <Input
              type="text"
              name="location"
              className="dashboard-search-input"
              placeholder="Enter city, neighborhood, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            />
            <Button type="submit" className="dashboard-search-btn" variant="ghost" aria-label="Search">
              <Search size={20} aria-hidden />
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
