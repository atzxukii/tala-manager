import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-coffee/10 px-4 sm:px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Hamburger mobile */}
        <button
          id="menu-toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-coffee/10 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <svg className="w-5 h-5 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-display text-coffee-dark">{title}</h1>
        </div>

        {/* Date & User Info */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-coffee-light border-r border-coffee/20 pr-4">
            <span>📅</span>
            <span>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long'
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-coffee-dark leading-none">{user?.name}</p>
              <p className="text-xs text-coffee-light">{user?.role === 'admin' ? 'Admin' : 'Employé'}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
