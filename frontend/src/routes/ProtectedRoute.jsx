import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isPrimeiroAcesso, perfilCompleto, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const isPrimeiroAcessoRoute = location.pathname === '/primeiro-acesso'
  const isOnboardingRoute = location.pathname === '/onboarding'

  // Redirect to primeiro acesso if needed
  if (isPrimeiroAcesso && !isPrimeiroAcessoRoute) {
    return <Navigate to="/primeiro-acesso" replace />
  }

  // Redirect to onboarding if perfil is incomplete (but not if already on onboarding or primeiro acesso)
  if (!isPrimeiroAcesso && !perfilCompleto && !isOnboardingRoute && !isPrimeiroAcessoRoute) {
    return <Navigate to="/onboarding" replace />
  }

  // Prevent access to onboarding if perfil is already complete
  if (perfilCompleto && isOnboardingRoute) {
    return <Navigate to="/dashboard" replace />
  }

  // Prevent access to primeiro acesso if not primeiro acesso
  if (!isPrimeiroAcesso && isPrimeiroAcessoRoute) {
    return <Navigate to="/dashboard" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
