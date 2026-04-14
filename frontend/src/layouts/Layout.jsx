import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Layout = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-bgDark to-slate-900">
      {isAuthenticated && <Navbar />}
      
      <main className={`min-h-screen pt-0 ${isAuthenticated ? 'pt-20' : 'pt-12'}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

