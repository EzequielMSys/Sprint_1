import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const Register = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', tipo: 'aluno' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.register(formData)
      alert(`Usuário criado!\nSenha temporária: ${formData.email}\nVerifique o console/backend para senha`)
      navigate('/login')
    } catch (error) {
      // Error handled by service
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-bgDark to-slate-900">
      <div className="max-w-md w-full space-y-8 card animate-fade-in">
        <div>
          <Link to="/" className="flex items-center space-x-2 mx-auto w-fit mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
          </Link>
          <h2 className="text-center text-3xl font-bold text-textPrimary">
            Criar Conta
          </h2>
          <p className="text-center text-textSecondary mt-2">
            Crie sua conta e receba uma senha temporária automaticamente
          </p>
          <div className="bg-accent/20 border border-accent/50 rounded-xl p-4 mt-6">
            <p className="text-sm text-accent font-semibold">
              👆 Senha temporária será gerada automaticamente e mostrada após cadastro
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-textSecondary mb-2">
              Nome Completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              className="input-field"
              placeholder="João Silva"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

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
              placeholder="joao@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-textSecondary mb-2">
              Tipo de Usuário
            </label>
            <select
              id="tipo"
              name="tipo"
              className="input-field"
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
            >
              <option value="aluno">Aluno</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </>
            ) : (
              'Criar Minha Conta'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-textSecondary">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold text-accent hover:text-yellow-400">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

