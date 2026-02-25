import { Routes, Route } from 'react-router-dom'
import { Auth, Callback, Dashboard, Landing } from './pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/welcome" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  )
}

export default App
