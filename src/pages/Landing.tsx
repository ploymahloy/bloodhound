import { Button } from '../components'
import '../Landing.css'

function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-hero">
        <h1 className="landing-title">Music Network</h1>
        <div className="landing-accent-line" aria-hidden />
        <p className="landing-tagline">
          Connect with artists, discover new sounds, and build your music
          community in one place.
        </p>
        <div className="landing-cta-wrap">
          <Button variant="primary" size="lg" className="landing-cta">
            Get started
          </Button>
          <Button variant="outline" size="lg">
            Learn more
          </Button>
        </div>
      </header>

      <section className="landing-cards">
        <article className="landing-card">
          <h3>For artists</h3>
          <p>
            Share your work, grow your audience, and collaborate with other
            creators.
          </p>
        </article>
        <article className="landing-card">
          <h3>For listeners</h3>
          <p>
            Discover new music, follow your favorites, and stay in the loop.
          </p>
        </article>
        <article className="landing-card">
          <h3>Together</h3>
          <p>
            One network for everyone who loves music.
          </p>
        </article>
      </section>
    </div>
  )
}

export default Landing
