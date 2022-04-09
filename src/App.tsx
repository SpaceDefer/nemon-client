import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Applications from './pages/applications'
import Machines from './pages/machines'

function App() {
  return (
    <div className='flex'>
      <Sidebar />
      <Routes>
        <Route path="/machines" element={<Machines />} />
        <Route path="/applications" element={<Applications />} />
        <Route
          path="/"
          element={<Navigate to="/applications" replace />}
        />
      </Routes>
    </div>
  )
}

export default App
