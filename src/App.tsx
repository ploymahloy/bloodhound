import { Routes, Route } from 'react-router-dom'
import { Auth, Callback, Landing, Results } from './pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/results" element={<Results />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  )
}

export default App
