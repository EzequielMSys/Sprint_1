import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-purple-700 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Estude com 
              <span className="bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
                Inteligência
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              A única plataforma que organiza seus estudos automaticamente e te leva ao sucesso nos vestibulares.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Link 
                to="/register"
                className="btn-primary text-lg py-4 px-12 w-full sm:w-auto shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Começar Agora
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary text-lg py-4 px-12 w-full sm:w-auto"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-32 bg-gradient-to-b from-slate-900 to-bgDark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
              Tudo que você precisa para{' '}
              <span className="text-accent">passar no vestibular</span>
            </h2>
            <p className="text-xl text-textSecondary max-w-2xl mx-auto">
              IA que entende seu perfil, cria cronogramas personalizados e organiza tudo automaticamente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group hover:scale-[1.02] transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-4">Cronogramas Inteligentes</h3>
              <p className="text-textSecondary leading-relaxed">
                IA analisa seu perfil e disponibilidade para criar o cronograma perfeito
              </p>
            </div>

            <div className="card text-center group hover:scale-[1.02] transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-4">100% Personalizado</h3>
              <p className="text-textSecondary leading-relaxed">
                Seu tempo de estudo, matérias prioritárias e metas. Tudo sob medida para você.
              </p>
            </div>

            <div className="card text-center group hover:scale-[1.02] transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-r from-accent to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-4">Resultados Garantidos</h3>
              <p className="text-textSecondary leading-relaxed">
                Milhares de alunos aprovados. Método testado e validado na prática.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-t from-slate-900 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-textPrimary mb-6">
            Pronto para transformar sua rotina de estudos?
          </h2>
          <p className="text-xl text-textSecondary mb-12 max-w-2xl mx-auto">
            Comece hoje e veja resultados em 30 dias ou sua garantia total.
          </p>
          <Link 
            to="/register"
            className="btn-primary text-xl py-6 px-16 shadow-2xl hover:shadow-3xl inline-block transform hover:-translate-y-2 transition-all duration-300"
          >
            Quero Aprovar Agora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing

