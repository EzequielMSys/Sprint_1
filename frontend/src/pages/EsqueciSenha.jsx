import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const EsqueciSenha = () => {
  const [email, setEmail] = useState('')
  const [senhaTemp, setSenhaTemp] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: email, 2: senha gerada
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.esqueciSenha(email)
      setSenhaTemp(response.senha_temporaria)
      setStep(2)
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
          <Link to="/login" className="flex items-center justify-center w-fit mx-auto mb-6">
            <svg className="w-8 h-8 text-textSecondary mr-2 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM12 9a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary mb-4">
            {step === 1 ? 'Esqueci minha senha' : 'Senha recuperada!'}
          </h2>
          <p className="text-textSecondary">
            {step === 1 
              ? 'Digite seu email e receba uma nova senha temporária'
              : 'Use esta senha temporária para fazer login e altere-a imediatamente'
            }
          </p>
        </div>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Email cadastrado
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                'Gerar Nova Senha'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 pt-8">
            <div className="bg-gradient-to-r from-accent to-yellow-500 text-white px-8 py-6 rounded-2xl shadow-2xl ring-4 ring-accent/30 mx-auto max-w-sm font-mono text-2xl font-black tracking-wider animate-pulse">
              {senhaTemp}
            </div>
            <div className="bg-white/5 border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-textPrimary mb-3">Como usar:</h3>
              <ol className="text-sm text-textSecondary space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-accent font-bold w-6 flex-shrink-0">1.</span>
                  <span>Vá para login e use esta senha</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent font-bold w-6 flex-shrink-0">2.</span>
                  <span>Altere imediatamente no primeiro acesso</span>
                </li>
              </ol>
            </div>
            <Link
              to="/login"
              className="btn-primary w-full text-lg py-4 font-semibold shadow-2xl"
            >
              Fazer Login Agora
            </Link>
          </div>
        )}

        <div className="text-center pt-8 border-t border-white/10">
          <Link to="/login" className="text-textSecondary hover:text-textPrimary font-semibold">
            ← Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EsqueciSenha

