import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const Onboarding = () => {
  const { user, updatePerfilCompleto } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    ano_escolar: '',
    objetivo: '',
    areas_foco: '',
    tempo_diario_min: 60,
    prazo_estimado: 30
  })

  const [disponibilidade, setDisponibilidade] = useState([
    { dia_semana: 'segunda', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 0 },
    { dia_semana: 'terca', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 0 },
    { dia_semana: 'quarta', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 0 },
    { dia_semana: 'quinta', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 0 },
    { dia_semana: 'sexta', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 0 },
    { dia_semana: 'sabado', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 0 },
    { dia_semana: 'domingo', hora_inicio: '08:00', hora_fim: '18:00', ocupado: 1 } // Domingo ocupado por padrão
  ])

  const handlePerfilSubmit = async (e) => {
    e.preventDefault()
    if (!formData.ano_escolar || !formData.objetivo || !formData.areas_foco) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStep(2)
      } else {
        throw new Error('Erro ao salvar perfil')
      }
    } catch (error) {
      toast.error('Erro ao salvar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleDisponibilidadeSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/perfil/disponibilidade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ dias: disponibilidade })
      })

      if (response.ok) {
        updatePerfilCompleto(true)
        toast.success('Perfil configurado com sucesso!')
        navigate('/dashboard')
      } else {
        throw new Error('Erro ao salvar disponibilidade')
      }
    } catch (error) {
      toast.error('Erro ao salvar disponibilidade')
    } finally {
      setLoading(false)
    }
  }

  const toggleDia = (index) => {
    const newDisponibilidade = [...disponibilidade]
    newDisponibilidade[index].ocupado = newDisponibilidade[index].ocupado ? 0 : 1
    setDisponibilidade(newDisponibilidade)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-bgDark to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-accent to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">
              Configurar Perfil de Estudos
            </h1>
            <p className="text-textSecondary">
              Vamos personalizar seu plano de estudos para obter os melhores resultados!
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handlePerfilSubmit} className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold text-textPrimary mb-6">Informações Básicas</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Ano Escolar *
                    </label>
                    <select
                      required
                      className="input-field"
                      value={formData.ano_escolar}
                      onChange={(e) => setFormData({...formData, ano_escolar: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      <option value="1º ano">1º ano</option>
                      <option value="2º ano">2º ano</option>
                      <option value="3º ano">3º ano</option>
                      <option value="Ensino Superior">Ensino Superior</option>
                      <option value="Pós-graduação">Pós-graduação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Objetivo de Estudo *
                    </label>
                    <select
                      required
                      className="input-field"
                      value={formData.objetivo}
                      onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      <option value="ENEM">ENEM</option>
                      <option value="Vestibular">Vestibular</option>
                      <option value="Concurso Público">Concurso Público</option>
                      <option value="Aperfeiçoamento">Aperfeiçoamento</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Áreas de Foco * (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Ex: Matemática, Português, Biologia"
                      value={formData.areas_foco}
                      onChange={(e) => setFormData({...formData, areas_foco: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Tempo Diário de Estudo (minutos)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="480"
                      className="input-field"
                      value={formData.tempo_diario_min}
                      onChange={(e) => setFormData({...formData, tempo_diario_min: parseInt(e.target.value)})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">
                      Prazo Estimado (dias)
                    </label>
                    <input
                      type="number"
                      min="7"
                      max="365"
                      className="input-field"
                      value={formData.prazo_estimado}
                      onChange={(e) => setFormData({...formData, prazo_estimado: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary mt-6"
                >
                  {loading ? 'Salvando...' : 'Próximo: Disponibilidade'}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleDisponibilidadeSubmit} className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold text-textPrimary mb-6">Disponibilidade Semanal</h2>
                <p className="text-textSecondary mb-6">
                  Marque os dias que você pode dedicar aos estudos e ajuste os horários.
                </p>

                <div className="space-y-3">
                  {disponibilidade.map((dia, index) => (
                    <div key={dia.dia_semana} className="flex items-center justify-between p-4 bg-bgSecondary rounded-xl">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={!dia.ocupado}
                          onChange={() => toggleDia(index)}
                          className="w-5 h-5 text-accent rounded focus:ring-accent"
                        />
                        <span className="text-textPrimary font-medium capitalize">
                          {dia.dia_semana}
                        </span>
                      </div>

                      {!dia.ocupado && (
                        <div className="flex items-center gap-2 text-sm text-textSecondary">
                          <input
                            type="time"
                            value={dia.hora_inicio}
                            onChange={(e) => {
                              const newDisp = [...disponibilidade]
                              newDisp[index].hora_inicio = e.target.value
                              setDisponibilidade(newDisp)
                            }}
                            className="bg-bgDark border border-border rounded px-2 py-1 text-xs"
                          />
                          <span>às</span>
                          <input
                            type="time"
                            value={dia.hora_fim}
                            onChange={(e) => {
                              const newDisp = [...disponibilidade]
                              newDisp[index].hora_fim = e.target.value
                              setDisponibilidade(newDisp)
                            }}
                            className="bg-bgDark border border-border rounded px-2 py-1 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 btn-secondary"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading ? 'Finalizando...' : 'Concluir Configuração'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Onboarding