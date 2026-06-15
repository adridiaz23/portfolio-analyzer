// Navbar component — fixed top bar with navigation links and live portfolio value
import { TrendingUp, BarChart3, Brain, RefreshCw } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { formatCurrency, formatPercent, isPositive } from '@/lib/utils'

const links = [
  { to: '/', icon: TrendingUp, label: 'Portfolio' },
  { to: '/analysis', icon: BarChart3, label: 'Analysis' },
  { to: '/ai', icon: Brain, label: 'AI Insights' },
]

export function Navbar() {
  // Pull live metrics so the navbar always shows current portfolio value
  const { totalValue, totalPnLPercent } = usePortfolioMetrics()
  const positive = isPositive(totalPnLPercent)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center px-6 gap-6">

      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <TrendingUp size={14} className="text-black" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-zinc-100 text-sm tracking-tight">
          Portfolio <span className="text-zinc-500 font-normal">Analyzer</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              )
            }
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right — live portfolio value */}
      <div className="ml-auto flex items-center gap-4">

        {/* Portfolio value pill */}
        <div className="hidden sm:flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
          <div>
            <div className="text-xs text-zinc-500 leading-none mb-0.5">Portfolio</div>
            <div className="text-sm font-mono font-medium text-zinc-100">{formatCurrency(totalValue)}</div>
          </div>
          <div className={cn('text-xs font-mono font-medium', positive ? 'text-emerald-400' : 'text-red-400')}>
            {formatPercent(totalPnLPercent)}
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden md:inline">Live</span>
        </div>

        {/* Refresh button — will trigger price refresh in Day 3 */}
        <button
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-zinc-300 transition-colors"
          title="Refresh prices"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  )
}