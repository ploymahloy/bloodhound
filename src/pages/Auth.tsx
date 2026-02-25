import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '../components'
import './Auth.css'

function Auth() {
  const { loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome to Music Network</h1>
        <div className="auth-card__accent-line" aria-hidden />
        <p className="auth-card__copy">
          Log in or create an account to connect with artists and discover new
          sounds.
        </p>
        <div className="auth-card__actions">
          <Button
            variant="primary"
            size="lg"
            className="auth-card__cta"
            onClick={handleLogin}
          >
            Log in
          </Button>
          <button
            type="button"
            className="auth-card__link"
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
