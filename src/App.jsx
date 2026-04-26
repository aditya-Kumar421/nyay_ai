import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PetitionerDashboard from './pages/PetitionerDashboard'
import LawyerDashboard from './pages/LawyerDashboard'
import BookDemo from './pages/BookDemo'
import MyCases from './pages/MyCases'
import SearchLawyers from './pages/SearchLawyers'
import MyProfile from './pages/MyProfile'

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('nyay_user') || 'null')
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'lawyer' ? '/lawyer' : '/petitioner'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route
          path="/my-cases"
          element={
            <ProtectedRoute role="petitioner">
              <MyCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-lawyers"
          element={
            <ProtectedRoute role="petitioner">
              <SearchLawyers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/petitioner"
          element={
            <ProtectedRoute role="petitioner">
              <PetitionerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer"
          element={
            <ProtectedRoute role="lawyer">
              <LawyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
