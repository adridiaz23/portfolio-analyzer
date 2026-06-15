// Analysis page — per-asset breakdown + placeholder for advanced metrics 
import { BarChart3, TrendingUp, AlertTriangle, PieChart } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { formatCurrency, formatPercent, isPositive } from '@/lib/utils'
import { cn } from '@/lib/utils'

// These metric cards are placeholders — 
const COMING_SOON = [
  { label: 'Sharpe Ratio',         icon: TrendingUp,    description: 'Risk-adjusted return vs benchmark' },
  { label: 'Volatility (30d)',      icon: AlertTriangle, description: 'Portfolio standard deviation' },
  { label: 'Diversification Score', icon: PieChart,      description: 'Asset & sector spread analysis' },
  { label: 'Beta vs S&P 500',       icon: BarChart3,     description: 'Market correlation coefficient' },
]

export function Analysis() {
  const { allocation } = usePortfolioMetrics()

  return (
    <div className="space-y-6">

      {/* Per-asset breakdown cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocation.map((item) => {
          const pos = isPositive(item.pnl)
          return (
            <Card key={item.ticker} className="flex items-center gap-4">
              {/* Ticker icon */}
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-xs font-bold text-zinc-300">{item.ticker.slice(0, 3)}</span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + P&L % */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-zinc-100">{item.ticker}</span>
                  <span className={cn('text-xs font-mono font-medium', pos ? 'text-emerald-400' : 'text-red-400')}>
                    {formatPercent(item.pnlPercent)}
                  </span>
                </div>

                {/* Weight + value */}
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-zinc-500">{item.percentage.toFixed(1)}% of portfolio</span>
                  <span className="text-xs text-zinc-400 font-mono">{formatCurrency(item.value)}</span>
                </div>

                {/* Mini allocation bar */}
                <div className="mt-1.5 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', pos ? 'bg-emerald-500' : 'bg-red-500')}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Advanced metrics */}
      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
          <BarChart3 size={14} />
          Advanced Metrics
          <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">Coming Day 9</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {COMING_SOON.map((m) => (
            <Card key={m.label} className="opacity-50">
              <div className="flex items-center gap-2 mb-2">
                <m.icon size={13} className="text-zinc-500" />
                <span className="text-xs text-zinc-400 font-medium">{m.label}</span>
              </div>
              <div className="text-xl font-mono text-zinc-600">—</div>
              <div className="text-xs text-zinc-600 mt-1">{m.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}