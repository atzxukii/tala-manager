import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',           icon: '📊', label: 'Dashboard'      },
  { to: '/chat',       icon: '💬', label: 'Directives / Chat' },
  { to: '/products',   icon: '📦', label: 'Produits'       },
  { to: '/stock',      icon: '🔄', label: 'Stock'          },
  { to: '/purchases',  icon: '🛒', label: "Liste d'achat"  },
  { to: '/history',    icon: '📋', label: 'Historique'     },
  { to: '/statistics', icon: '📈', label: 'Statistiques'   },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-coffee-darker/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          w-64 bg-coffee-dark text-cream
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-coffee/30">
          <div className="flex flex-col">
            <span className="font-display text-4xl text-cream tracking-tight leading-none">tala</span>
            <span className="text-[10px] text-coffee-pale uppercase tracking-[0.2em] mt-1 ml-0.5">coffee shop</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
                 transition-all duration-150 group
                 ${isActive
                   ? 'bg-coffee text-cream border-r-4 border-coffee-pale'
                   : 'text-coffee-pale hover:bg-coffee/40 hover:text-cream'
                 }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="px-6 py-4 border-t border-coffee/30">
          <p className="text-[10px] text-coffee-pale uppercase tracking-widest font-bold">tala-manager beta 0.1</p>
        </div>
      </aside>
    </>
  )
}
