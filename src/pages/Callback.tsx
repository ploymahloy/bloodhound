import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import './Callback.css'

function Callback() {
  const { isAuthenticated, isLoading, error } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) return
    if (error) {
      navigate('/login', { replace: true })
      return
    }
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, error, navigate])

  return (
    <div className="auth-callback">
      <span className="loader"></span>
    </div>
  )
}

export default Callback
