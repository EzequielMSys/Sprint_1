import { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import authService from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  primeiroAcesso: false,
  perfilCompleto: false,
  loading: true
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        primeiroAcesso: action.payload.primeiro_acesso,
        perfilCompleto: action.payload.perfil_completo,
        loading: false
      }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    case 'UPDATE_PERFIL_COMPLETO':
      return { ...state, perfilCompleto: action.payload }
    case 'LOGOUT':
      return initialState
    case 'LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const primeiroAcesso = localStorage.getItem('primeiro_acesso') === 'true'
    const perfilCompleto = localStorage.getItem('perfil_completo') === 'true'

    if (token && user) {
      const parsedUser = JSON.parse(user)
      const apelido = localStorage.getItem('apelido')
      if (apelido) parsedUser.apelido = apelido

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: parsedUser,
          primeiro_acesso: primeiroAcesso,
          perfil_completo: perfilCompleto
        }
      })
    }
    dispatch({ type: 'LOADING', payload: false })
  }, [])

  const login = async (email, senha) => {
    try {
      dispatch({ type: 'LOADING', payload: true })
      const response = await authService.login(email, senha)

      // Check if perfil is complete
      const perfilCompleto = await checkPerfilCompleto(response.usuario.id)

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.usuario))
      localStorage.setItem('primeiro_acesso', response.primeiro_acesso ? 'true' : 'false')
      localStorage.setItem('perfil_completo', perfilCompleto ? 'true' : 'false')

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.token,
          user: response.usuario,
          primeiro_acesso: response.primeiro_acesso,
          perfil_completo: perfilCompleto
        }
      })

      toast.success('Login realizado com sucesso!')

      // Handle redirect based on user state
      if (response.primeiro_acesso) {
        navigate('/primeiro-acesso')
      } else if (!perfilCompleto) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }

      return response
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
      throw error
    } finally {
      dispatch({ type: 'LOADING', payload: false })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('primeiro_acesso')
    localStorage.removeItem('perfil_completo')
    localStorage.removeItem('apelido')
    dispatch({ type: 'LOGOUT' })
    toast.success('Ate logo!')
    navigate('/')
  }

  const checkPerfilCompleto = async (usuarioId) => {
    try {
      // Check if perfil exists and has required fields
      const response = await fetch('/api/perfil', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const { perfil, disponibilidade } = await response.json()
        return perfil && perfil.areas_foco && disponibilidade && disponibilidade.length > 0
      }
      return false
    } catch (error) {
      console.error('Erro ao verificar perfil:', error)
      return false
    }
  }

  const updatePerfilCompleto = (completo) => {
    localStorage.setItem('perfil_completo', completo ? 'true' : 'false')
    dispatch({ type: 'UPDATE_PERFIL_COMPLETO', payload: completo })
  }

  const updateUser = (data) => {
    const updatedUser = { ...state.user, ...data }
    if (data.apelido !== undefined) {
      if (data.apelido) {
        localStorage.setItem('apelido', data.apelido)
      } else {
        localStorage.removeItem('apelido')
      }
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    dispatch({ type: 'UPDATE_USER', payload: updatedUser })
  }

  const podeAcessarAdmin = state.user?.tipo === 'admin' || state.user?.tipo === 'dono'

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    updatePerfilCompleto,
    isAuthenticated: !!state.token,
    isAdmin: podeAcessarAdmin,
    isDono: state.user?.tipo === 'dono',
    isPrimeiroAcesso: state.primeiroAcesso,
    perfilCompleto: state.perfilCompleto
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
