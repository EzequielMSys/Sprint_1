import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.senha)
      
      // Redirect based on primeiro_acesso
      const isPrimeiroAcesso = localStorage.getItem('primeiro_acesso') === 'true'
      if (isPrimeiroAcesso) {
        navigate('/primeiro-acesso')
      } else {
        navigate('/inicio')
      }
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-bgDark to-slate-900">
      <div className="max-w-md w-full space-y-8 card animate-fade-in">
        <div>
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-textPrimary">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-center text-textSecondary">
            Digite suas credenciais para acessar sua conta
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textSecondary mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-textSecondary mb-2">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/esqueci-senha" className="text-accent hover:text-yellow-400 font-semibold group">
                Esqueci minha senha
                <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-textSecondary">
            Não tem conta?{' '}
            <Link to="/register" className="font-semibold text-accent hover:text-yellow-400">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

