import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PrimeiroAcesso from './pages/PrimeiroAcesso'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Cronograma from './pages/Cronograma'
import Perfil from './pages/Perfil'
import AlterarSenha from './pages/AlterarSenha'
import EsqueciSenha from './pages/EsqueciSenha'
import UsuariosAdmin from './pages/UsuariosAdmin'
import Layout from './layouts/Layout'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        
        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/inicio" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/alterar-senha" element={<AlterarSenha />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/usuarios" element={<UsuariosAdmin />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
