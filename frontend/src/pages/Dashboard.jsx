import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    estudosHoje: 0,
    metaSemana: 75,
    atividadesConcluidas: 23
  })

  return (
    <div className="min-h-screen pt-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              Olá, <span className="text-accent">{user?.nome}</span>!
            </h1>
            <p className="text-xl text-textSecondary">
              Vamos continuar sua jornada rumo à aprovação 🚀
            </p>
          </div>
          <Link 
            to="/perfil"
            className="btn-primary self-start lg:self-end mt-4 lg:mt-0 px-8 py-3 text-lg"
          >
            Meu Perfil
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="card p-8 text-center group hover:scale-[1.02] transition-all duration-300">
            <div className="text-4xl mb-4">
              <span className="text-primary font-black">{stats.estudosHoje}h</span>
            </div>
            <h3 className="text-2xl font-bold text-textPrimary mb-2">Hoje</h3>
            <p className="text-textSecondary">Horas de estudo concluídas</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div className="bg-gradient-to-r from-secondary to-green-500 h-3 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>

          <div className="card p-8 text-center group hover:scale-[1.02] transition-all duration-300">
            <div className="text-4xl mb-4">
              <span className={stats.metaSemana >= 80 ? 'text-secondary font-black' : 'text-accent font-black'}>
                {stats.metaSemana}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-textPrimary mb-2">Semana</h3>
            <p className="text-textSecondary">Meta semanal de progresso</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div className="bg-gradient-to-r from-accent to-yellow-500 h-3 rounded-full" style={{width: `${stats.metaSemana}%`}}></div>
            </div>
          </div>

          <div className="card p-8 text-center group hover:scale-[1.02] transition-all duration-300">
            <div className="text-4xl mb-4">
              <span className="text-green-400 font-black">+{stats.atividadesConcluidas}</span>
            </div>
            <h3 className="text-2xl font-bold text-textPrimary mb-2">Atividades</h3>
            <p className="text-textSecondary">Concluídas esta semana</p>
            <div className="mt-4">
              <span className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                +12% vs semana passada
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-textPrimary mb-6 flex items-center">
                <svg className="w-8 h-8 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Próximas Atividades
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Matemática - Equações', time: 'Hoje 14:30', progress: 0 },
                  { title: 'Português - Interpretação', time: 'Hoje 16:00', progress: 75 },
                  { title: 'História - Revolução', time: 'Amanhã 09:00', progress: 0 }
                ].map((atividade, index) => (
                  <div key={index} className="flex items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <div className="w-2 h-2 bg-primary rounded-full mr-4 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-textPrimary truncate">{atividade.title}</p>
                      <p className="text-sm text-textSecondary">{atividade.time}</p>
                    </div>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-secondary to-green-500 h-2 rounded-full" 
                        style={{width: `${atividade.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-textPrimary mb-6">Ação Rápida</h3>
              <div className="space-y-4">
                <Link to="/perfil" className="block w-full btn-secondary text-left py-4 px-6 hover:shadow-lg">
                  <svg className="w-5 h-5 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Meu Perfil
                </Link>
                <Link to="/alterar-senha" className="block w-full btn-secondary text-left py-4 px-6 hover:shadow-lg">
                  <svg className="w-5 h-5 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17l-1 1h2v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1h2l1-1L5 14.743A6 6 0 012 12a6 6 0 0112-3z" />
                  </svg>
                  Alterar Senha
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

