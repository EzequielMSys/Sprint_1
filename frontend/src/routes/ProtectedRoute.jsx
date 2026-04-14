import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isPrimeiroAcesso, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (isPrimeiroAcesso) {
    return <Navigate to="/primeiro-acesso" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/inicio" replace />
  }

  return children
}

export default ProtectedRoute

