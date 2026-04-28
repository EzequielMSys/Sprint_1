import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

export default function Cronograma() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent mb-4">
            Cronograma de Estudos
          </h1>
          <p className="text-lg text-textSecondary mb-8">
            Organize seus estudos de forma inteligente.
          </p>

          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-indigo-500 mx-auto flex items-center justify-center text-white shadow-xl mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-2">Em breve</h2>
            <p className="text-textSecondary max-w-md mx-auto">
              O cronograma inteligente está sendo desenvolvido. Em breve você poderá criar e gerenciar seu plano de estudos personalizado.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

