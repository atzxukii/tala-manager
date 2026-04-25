import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar  from './components/layout/Topbar'
import Dashboard   from './pages/Dashboard'
import Products    from './pages/Products'
import Stock       from './pages/Stock'
import History     from './pages/History'
import PurchaseList from './pages/PurchaseList'
import TeamChat from './pages/TeamChat'
import Statistics from './pages/Statistics'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

const pageTitles = {
  '/':          '☕ Tableau de bord',
  '/products':  '📦 Produits',
  '/stock':     '🔄 Gestion des Stocks',
  '/history':   '📋 Historique',
  '/purchases': '🛒 Liste d\'achat',
  '/chat':      '💬 Directives',
  '/statistics':'📊 Statistiques',
}

export default function App() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const path   = window.location.pathname
  const title  = pageTitles[path] || '☕ Tala Coffee Shop'

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/products"  element={<Products />} />
            <Route path="/stock"     element={<Stock />} />
            <Route path="/history"   element={<History />} />
            <Route path="/purchases" element={<PurchaseList />} />
            <Route path="/chat"      element={<TeamChat />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="*" element={
              <div className="flex items-center justify-center h-full text-center p-10">
                <div>
                  <p className="text-5xl mb-4">☕</p>
                  <p className="text-xl font-display text-coffee">Page introuvable</p>
                  <a href="/" className="btn-primary inline-flex mt-4">Retour au dashboard</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}
