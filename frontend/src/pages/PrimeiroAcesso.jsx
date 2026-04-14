import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import usuarioService from '../services/usuarioService'

const PrimeiroAcesso = () => {
  const [formData, setFormData] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.nova_senha !== formData.confirmar_senha) {
      alert('Senhas não coincidem!')
      return
    }

    setLoading(true)
    try {
      await authService.trocarSenhaPrimeiroAcesso(
        formData.senha_atual,
        formData.nova_senha,
        formData.confirmar_senha
      )
      
      // Refresh login to update primeiro_acesso status
      const response = await login(user.email, formData.nova_senha)
      
      navigate('/inicio')
    } catch (error) {
      // Error handled by service
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-bgDark to-slate-900">
      <div className="max-w-md w-full space-y-8 card animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-accent to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary mb-2">
            Primeiro Acesso
          </h2>
          <div className="bg-gradient-to-r from-accent/20 to-orange-500/20 border-2 border-accent/30 rounded-2xl p-6 mb-8">
            <p className="text-accent font-semibold text-lg mb-2">
              ⚠️ Troca obrigatória
            </p>
            <p className="text-textSecondary text-sm">
              Use sua senha temporária atual e crie uma nova senha segura
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">
              Senha Atual (temporária)
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="Senha temporária recebida"
              value={formData.senha_atual}
              onChange={(e) => setFormData({...formData, senha_atual: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">
              Nova Senha (mín 8 caracteres, 1 maiúscula, 1 número)
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="Nova senha segura"
              value={formData.nova_senha}
              onChange={(e) => setFormData({...formData, nova_senha: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="Confirme a nova senha"
              value={formData.confirmar_senha}
              onChange={(e) => setFormData({...formData, confirmar_senha: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 font-semibold shadow-2xl hover:shadow-3xl"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Alterando...
              </>
            ) : (
              'Definir Nova Senha'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrimeiroAcesso

