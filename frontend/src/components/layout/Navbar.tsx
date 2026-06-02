import { TrendingUp, BarChart3, Brain, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', icon: TrendingUp, label: 'Portfolio' },
  { to: '/analysis', icon: BarChart3, label: 'Analysis' },
  { to: '/ai', icon: Brain, label: 'AI Insights' },
]

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 flex items-center px-6">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
          <TrendingUp size={15} className="text-black" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-zinc-100 text-sm tracking-tight">Portfolio Analyzer</span>
      </div>

      <nav className="flex items-center gap-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live prices
        </div>
        <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </header>
  )
}
