import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const IconBook = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
const IconChart = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
const IconBolt = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
const IconUser = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const IconLock = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
const IconClock = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [atividades, setAtividades] = useState(null)
  const [cronograma, setCronograma] = useState(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // TODO: Integrar com APIs reais quando disponiveis
        // const atividadesRes = await atividadeService.listar()
        // const cronogramaRes = await cronogramaService.listar()
        // setAtividades(atividadesRes)
        // setCronograma(cronogramaRes)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const displayName = user?.apelido || user?.nome || 'Estudante'
  const tipoLabelMap = {
    dono: 'Dono',
    admin: 'Administrador',
    docente: 'Docente',
    aluno: 'Aluno'
  }
  const tipoLabel = tipoLabelMap[user?.tipo] || 'Aluno'

  const stats = {
    concluidas: atividades?.filter(a => a.status === 'concluida')?.length || 0,
    pendentes: atividades?.filter(a => a.status === 'pendente')?.length || 0,
    progresso: atividades?.length ? Math.round((atividades.filter(a => a.status === 'concluida').length / atividades.length) * 100) : 0,
    horas: 0 // TODO: Calculate from cronograma when implemented
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-textPrimary">
              Ola, {displayName} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-textSecondary mt-2 text-lg">
              {tipoLabel} • Pronto para seus estudos de hoje?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cronograma" className="btn-primary px-6 py-3 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <IconBook />
              <span>Montar cronograma</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-green-400 flex items-center justify-center text-white shadow-lg">
                <IconCheck />
              </div>
              <span className="text-3xl font-black text-textPrimary">{stats.concluidas}</span>
            </div>
            <p className="text-textSecondary font-medium">Atividades concluidas</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                <IconClock />
              </div>
              <span className="text-3xl font-black text-textPrimary">{stats.pendentes}</span>
            </div>
            <p className="text-textSecondary font-medium">Atividades pendentes</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center text-white shadow-lg">
                <IconChart />
              </div>
              <span className="text-3xl font-black text-textPrimary">{stats.progresso}%</span>
            </div>
            <p className="text-textSecondary font-medium">Progresso geral</p>
            <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${stats.progresso}%` }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <IconBolt />
              </div>
              <span className="text-3xl font-black text-textPrimary">{stats.horas}h</span>
            </div>
            <p className="text-textSecondary font-medium">Horas estudadas</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-textPrimary">Proximas atividades</h2>
              <Link to="/atividades" className="text-primary hover:text-primary-light font-semibold transition-colors">Ver todas</Link>
            </div>
            
            {!atividades || atividades.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center text-textSecondary">
                  <IconBook />
                </div>
                <h3 className="text-xl font-bold text-textPrimary mb-2">Nenhuma atividade disponivel ainda</h3>
                <p className="text-textSecondary mb-6">Voce ainda nao montou seu cronograma.</p>
                <Link to="/cronograma" className="btn-primary px-6 py-3 rounded-2xl font-bold text-white inline-flex items-center gap-2">
                  Montar cronograma
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {atividades.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <IconBook />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-textPrimary">{a.titulo || a.materia}</p>
                      <p className="text-sm text-textSecondary">{a.descricao || a.topico}</p>
                    </div>
                    <span className="text-sm text-textSecondary">{a.tempo_estimado} min</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-6">
            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 mx-auto flex items-center justify-center shadow-xl ring-4 ring-violet-500/20 mb-3">
                <IconBolt />
              </div>
              <p className="text-3xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">0 XP</p>
              <p className="text-sm text-textSecondary mt-1">Nivel 1</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-indigo-400 h-full rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-xs text-textSecondary mt-2">100 XP ate o proximo nivel</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-3xl font-black text-orange-400">0 dias</p>
              <p className="text-sm text-textSecondary mt-1">Sequencia de estudos</p>
              <div className="flex justify-center gap-1.5 mt-3">
                {[1,2,3,4,5].map(d => (
                  <div key={d} className="w-3 h-3 rounded-full bg-white/10" />
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold text-textPrimary mb-4">Acoes rapidas</h3>
              <div className="space-y-3">
                <Link to="/cronograma" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><IconBook /></div>
                  <span className="font-medium text-textPrimary">Montar cronograma</span>
                </Link>
                <Link to="/perfil" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400"><IconUser /></div>
                  <span className="font-medium text-textPrimary">Editar perfil</span>
                </Link>
                <Link to="/alterar-senha" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400"><IconLock /></div>
                  <span className="font-medium text-textPrimary">Alterar senha</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
