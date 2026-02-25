import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Auth from './pages/Auth.tsx'
import Callback from './pages/Callback.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  )
}

export default App
