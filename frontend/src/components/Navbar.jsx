import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-r from-bgDark to-slate-900/50 backdrop-blur-md border-b border-white/10 shadow-xl fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Plataforma Estudos
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/perfil" 
                className="text-textSecondary hover:text-textPrimary px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                {user.nome}
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/usuarios" 
                  className="text-textSecondary hover:text-accent px-3 py-2 rounded-xl hover:bg-accent/10 transition-all duration-200 font-semibold"
                >
                  Usuários
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

