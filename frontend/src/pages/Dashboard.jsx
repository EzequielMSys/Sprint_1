import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const IconBook = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
const IconChart = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
const IconBolt = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
const IconFire = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
const IconUser = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const IconLock = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
const IconClock = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IconRight = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

const statsMock = [
  { label: 'Total de atividades', value: 42, icon: <IconBook />, color: 'from-violet-500 to-purple-500', ring: 'ring-purple-500/20' },
  { label: 'Atividades concluídas', value: 27, icon: <IconCheck />, color: 'from-emerald-500 to-green-500', ring: 'ring-emerald-500/20' },
  { label: 'Progresso geral', value: '64%', icon: <IconChart />, color: 'from-amber-500 to-orange-500', ring: 'ring-amber-500/20' },
]

const tarefasMock = [
  { titulo: 'Matemática - Equações', hora: 'Hoje 14:30', progresso: 0, feito: false },
  { titulo: 'Português - Interpretação', hora: 'Hoje 16:00', progresso: 75, feito: false },
  { titulo: 'História - Revolução', hora: 'Amanhã 09:00', progresso: 0, feito: false },
  { titulo: 'Física - Cinemática', hora: 'Amanhã 14:00', progresso: 30, feito: false },
]

const gamificationMock = { xp: 1240, nivel: 3, streak: 5, proximo: 1760, missao: 'Completar 5 atividades' }

export default function Dashboard() {
  const { user } = useAuth()
  const [stats] = useState(statsMock)
  const [tarefas] = useState(tarefasMock)
  const [game] = useState(gamificationMock)

  const nome = user?.apelido || user?.nome || 'Estudante'

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Olá, {nome}</span> <span className="text-4xl md:text-5xl">👋</span>
            </h1>
            <p className="mt-2 text-lg text-textSecondary">Vamos continuar sua jornada rumo à aprovação 🚀</p>
          </div>
          <div className="flex gap-3">
            <Link to="/cronograma" className="btn-primary flex items-center gap-2 text-base py-2.5 px-5">
              <IconBook /> Ver cronograma
            </Link>
            <Link to="/perfil" className="btn-secondary flex items-center gap-2 text-base py-2.5 px-5">
              <IconUser /> Editar perfil
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-card p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} ring-4 ${s.ring} flex items-center justify-center text-white shadow-lg`}>
                {s.icon}
              </div>
              <div>
                <p className="text-sm text-textSecondary font-medium">{s.label}</p>
                <p className="text-3xl font-black text-textPrimary mt-0.5">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Middle section */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Tarefas */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white shadow-lg"><IconBook /></div>
              <h2 className="text-xl font-bold text-textPrimary">Próximas atividades</h2>
            </div>
            <div className="space-y-3">
              {tarefas.map((t, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-textPrimary truncate">{t.titulo}</p>
                    <p className="text-xs text-textSecondary flex items-center gap-1 mt-0.5"><IconClock /> {t.hora}</p>
                  </div>
                  <div className="w-24 bg-white/10 rounded-full h-2 overflow-hidden flex-shrink-0">
                    <div className={`h-full rounded-full ${t.progresso === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-indigo-400'}`} style={{ width: `${t.progresso}%` }} />
                  </div>
                  <span className="text-xs font-bold text-textSecondary w-8 text-right flex-shrink-0">{t.progresso}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gamification */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
            {/* XP Card */}
            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 mx-auto flex items-center justify-center shadow-xl ring-4 ring-violet-500/20 mb-3">
                <IconBolt />
              </div>
              <p className="text-3xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">{game.xp} XP</p>
              <p className="text-sm text-textSecondary mt-1">Nível {game.nivel}</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-indigo-400 h-full rounded-full" style={{ width: `${(game.xp / game.proximo) * 100}%` }} />
              </div>
              <p className="text-xs text-textSecondary mt-2">{game.proximo - game.xp} XP até o próximo nível</p>
            </div>

            {/* Streak */}
            <div className="glass-card p-6 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-3xl font-black text-orange-400">{game.streak} dias</p>
              <p className="text-sm text-textSecondary mt-1">Sequência de estudos</p>
              <div className="flex justify-center gap-1.5 mt-3">
                {[1,2,3,4,5].map(d => (
                  <div key={d} className={`w-3 h-3 rounded-full ${d <= game.streak ? 'bg-orange-400 shadow-orange-400/50 shadow-md' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            {/* Missão */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white"><IconBolt /></div>
                <p className="font-bold text-textPrimary text-sm">Missão do dia</p>
              </div>
              <p className="text-sm text-textSecondary">{game.missao}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

