import { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import authService from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  primeiroAcesso: false,
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
        loading: false
      }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
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
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: JSON.parse(user),
          primeiro_acesso: primeiroAcesso
        }
      })
    }
    dispatch({ type: 'LOADING', payload: false })
  }, [])

  const login = async (email, senha) => {
    try {
      dispatch({ type: 'LOADING', payload: true })
      const response = await authService.login(email, senha)
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.usuario))
      localStorage.setItem('primeiro_acesso', response.primeiro_acesso ? 'true' : 'false')
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.token,
          user: response.usuario,
          primeiro_acesso: response.primeiro_acesso
        }
      })

      toast.success('Login realizado com sucesso!')
      
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
    dispatch({ type: 'LOGOUT' })
    toast.success('Até logo!')
    navigate('/')
  }

  const value = {
    ...state,
    login,
    logout,
    isAuthenticated: !!state.token,
    isAdmin: state.user?.tipo === 'admin',
    isPrimeiroAcesso: state.primeiroAcesso
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

