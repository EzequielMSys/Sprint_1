import { useState, useEffect } from 'react'
import usuarioService from '../services/usuarioService'
import { toast } from 'react-hot-toast'

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState({ busca: '', tipo: '' })
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ nome: '', email: '', tipo: 'aluno' })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    setLoading(true)
    try {
      const data = await usuarioService.listar()
      setUsuarios(data)
    } catch (error) {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const handleEditar = (usuario) => {
    setEditingUser(usuario)
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    })
  }

  const handleSalvarEdicao = async (id) => {
    try {
      await usuarioService.atualizar(id, formData)
      toast.success('Usuário atualizado!')
      carregarUsuarios()
      setEditingUser(null)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar')
    }
  }

  const handleAtivarDesativar = async (id, ativo) => {
    try {
      await usuarioService.alterarStatus(id, ativo)
      toast.success('Status alterado!')
      carregarUsuarios()
    } catch (error) {
      toast.error('Erro ao alterar status')
    }
  }

  const handleResetSenha = async (id) => {
    if (!confirm('Redefinir senha para este usuário?')) return
    
    try {
      await usuarioService.resetarSenha(id)
      toast.success('Senha redefinida! Nova temp senha mostrada no console')
      carregarUsuarios()
    } catch (error) {
      toast.error('Erro ao resetar senha')
    }
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const matchesBusca = u.nome.toLowerCase().includes(filtro.busca.toLowerCase()) ||
                         u.email.toLowerCase().includes(filtro.busca.toLowerCase())
    const matchesTipo = !filtro.tipo || u.tipo === filtro.tipo
    return matchesBusca && matchesTipo
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textPrimary font-semibold">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
              Gerenciar Usuários
            </h1>
            <p className="text-xl text-textSecondary">
              Administre contas dos alunos e professores
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex bg-white/5 rounded-xl p-1">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="bg-transparent px-4 py-2 text-textPrimary placeholder-textSecondary outline-none flex-1"
                value={filtro.busca}
                onChange={(e) => setFiltro({...filtro, busca: e.target.value})}
              />
            </div>
            <select
              className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-textPrimary"
              value={filtro.tipo}
              onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="aluno">Aluno</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="card overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-6 text-textPrimary font-semibold text-lg border-b border-white/10">Nome</th>
                  <th className="text-left p-6 text-textPrimary font-semibold text-lg border-b border-white/10">Email</th>
                  <th className="text-left p-6 text-textPrimary font-semibold text-lg border-b border-white/10">Tipo</th>
                  <th className="text-left p-6 text-textPrimary font-semibold text-lg border-b border-white/10">Status</th>
                  <th className="text-left p-6 text-textPrimary font-semibold text-lg border-b border-white/10">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="p-6 font-semibold text-textPrimary">
                      {editingUser?.id === usuario.id ? (
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="input-field bg-white/20 w-full text-lg"
                          autoFocus
                        />
                      ) : (
                        usuario.nome
                      )}
                    </td>
                    <td className="p-6 text-textSecondary font-mono text-sm truncate max-w-xs">
                      {editingUser?.id === usuario.id ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="input-field bg-white/20 w-full text-sm"
                        />
                      ) : (
                        usuario.email
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        usuario.tipo === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-400/30 border' 
                          : 'bg-blue-500/20 text-blue-400 border-blue-400/30 border'
                      }`}>
                        {usuario.tipo === 'admin' ? 'Admin' : 'Aluno'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        usuario.ativo 
                          ? 'bg-green-500/20 text-secondary border-green-400/30 border' 
                          : 'bg-red-500/20 text-red-400 border-red-400/30 border'
                      }`}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {editingUser?.id === usuario.id ? (
                          <>
                            <button
                              onClick={() => handleSalvarEdicao(usuario.id)}
                              className="px-4 py-2 bg-gradient-to-r from-secondary to-green-500 text-white rounded-xl text-sm font-semibold hover:from-secondary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-textPrimary rounded-xl text-sm font-semibold transition-all duration-200"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditar(usuario)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                              title="Editar"
                            >
                              <svg className="w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleAtivarDesativar(usuario.id, !usuario.ativo)}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                usuario.ativo 
                                  ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300' 
                                  : 'hover:bg-green-500/20 text-secondary hover:text-green-300'
                              }`}
                              title={usuario.ativo ? 'Desativar' : 'Ativar'}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={usuario.ativo ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleResetSenha(usuario.id)}
                              className="p-2 hover:bg-yellow-500/20 text-accent hover:text-yellow-300 rounded-lg transition-all duration-200"
                              title="Reset Senha"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {usuariosFiltrados.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-2">Nenhum usuário encontrado</h3>
              <p className="text-textSecondary">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>

        <div className="text-sm text-textSecondary mt-8 text-center">
          Total: <span className="font-semibold text-textPrimary">{usuarios.length}</span> usuários
        </div>
      </div>
    </div>
  )
}

export default UsuariosAdmin

