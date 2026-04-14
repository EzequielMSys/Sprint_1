import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import usuarioService from '../services/usuarioService'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Perfil = () => {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await usuarioService.atualizar(user.id, formData)
      toast.success('Perfil atualizado com sucesso!')
      
      // Update local state
      localStorage.setItem('user', JSON.stringify(response.usuario))
      window.location.reload() // Simple refresh to update context
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-2xl mx-auto mb-8 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-textPrimary mb-2">Carregando perfil...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl ring-8 ring-white/20">
            <span className="text-5xl font-black text-white">
              {user.nome?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-textPrimary to-textSecondary bg-clip-text text-transparent mb-4">
            {user.nome}
          </h1>
          <p className="text-xl text-textSecondary">
            {user.tipo === 'admin' ? 'Administrador' : 'Aluno'} | Membro desde {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Perfil Form */}
        <div className="card p-10 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-textPrimary">
              Informações do Perfil
            </h2>
            <div className="flex gap-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:from-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-secondary to-green-500 text-white rounded-xl font-semibold hover:from-secondary/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setFormData({ nome: user.nome, email: user.email })
                    }}
                    className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-textPrimary rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-3">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  disabled={!editing}
                  className={`w-full px-5 py-4 rounded-2xl text-lg font-semibold border-2 transition-all duration-200 ${
                    editing 
                      ? 'border-primary/30 bg-white/20 focus:border-primary focus:ring-4 focus:ring-primary/20' 
                      : 'border-transparent bg-white/10 cursor-not-allowed'
                  }`}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-3">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!editing}
                  className={`w-full px-5 py-4 rounded-2xl text-lg font-semibold border-2 transition-all duration-200 ${
                    editing 
                      ? 'border-primary/30 bg-white/20 focus:border-primary focus:ring-4 focus:ring-primary/20' 
                      : 'border-transparent bg-white/10 cursor-not-allowed'
                  }`}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Security Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8 hover:shadow-3xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-textPrimary">Segurança da Conta</h3>
                <p className="text-textSecondary text-sm">Mantenha sua conta protegida</p>
              </div>
            </div>
            <Link 
              to="/alterar-senha"
              className="inline-flex items-center text-primary hover:text-primary/80 font-semibold group"
            >
              Alterar Senha
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="card p-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-textPrimary">Conta Ativa</h3>
                <p className="text-textSecondary text-sm">Status da sua conta</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-secondary to-green-500 text-white rounded-full text-sm font-semibold shadow-lg">
                ✅ Ativa
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-20 pt-12 border-t border-white/10">
          <button
            onClick={logout}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-textPrimary rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Perfil

