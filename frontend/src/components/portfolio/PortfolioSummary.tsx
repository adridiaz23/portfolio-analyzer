// PortfolioSummary — 4 metric cards shown at the top of the Dashboard
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatPercent, isPositive } from '@/lib/utils'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { cn } from '@/lib/utils'

export function PortfolioSummary() {
  const { totalInvested, totalValue, totalPnL, totalPnLPercent, allocation } = usePortfolioMetrics()
  const positive = isPositive(totalPnL)

  // Find the best performing asset by P&L %
  const best = allocation.length
    ? allocation.reduce((a, b) => (a.pnlPercent > b.pnlPercent ? a : b))
    : null

  const stats = [
    {
      label: 'Total Value',
      value: formatCurrency(totalValue),
      sub: `Invested: ${formatCurrency(totalInvested)}`,
      icon: DollarSign,
      color: 'text-zinc-100',
      subColor: 'text-zinc-500',
    },
    {
      label: 'Total P&L',
      value: formatCurrency(totalPnL),
      sub: formatPercent(totalPnLPercent),
      icon: positive ? TrendingUp : TrendingDown,
      color: positive ? 'text-emerald-400' : 'text-red-400',
      subColor: positive ? 'text-emerald-400/60' : 'text-red-400/60',
    },
    {
      label: 'Best Performer',
      value: best ? best.ticker : '—',
      sub: best ? formatPercent(best.pnlPercent) : '—',
      icon: TrendingUp,
      color: 'text-emerald-400',
      subColor: 'text-emerald-400/60',
    },
    {
      label: 'Assets',
      value: allocation.length.toString(),
      sub: 'Stocks, ETFs & Crypto',
      icon: Activity,
      color: 'text-blue-400',
      subColor: 'text-zinc-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-3">
          {/* Label + icon row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              {stat.label}
            </span>
            <stat.icon size={14} className={cn('opacity-50', stat.color)} />
          </div>

          {/* Value + sub */}
          <div>
            <div className={cn('text-xl font-semibold font-mono', stat.color)}>
              {stat.value}
            </div>
            <div className={cn('text-xs mt-0.5 font-mono', stat.subColor)}>
              {stat.sub}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}