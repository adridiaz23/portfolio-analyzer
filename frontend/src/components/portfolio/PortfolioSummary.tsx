import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatPercent, isPositive } from '@/lib/utils'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { cn } from '@/lib/utils'

export function PortfolioSummary() {
  const { totalInvested, totalValue, totalPnL, totalPnLPercent } = usePortfolioMetrics()
  const positive = isPositive(totalPnL)

  const stats = [
    {
      label: 'Total Value',
      value: formatCurrency(totalValue),
      sub: `Invested: ${formatCurrency(totalInvested)}`,
      icon: DollarSign,
      color: 'text-zinc-300',
    },
    {
      label: 'Total P&L',
      value: formatCurrency(totalPnL),
      sub: formatPercent(totalPnLPercent),
      icon: positive ? TrendingUp : TrendingDown,
      color: positive ? 'text-emerald-400' : 'text-red-400',
    },
    {
      label: 'Best Performer',
      value: 'MSFT',
      sub: '+43.7%',
      icon: Activity,
      color: 'text-emerald-400',
    },
    {
      label: 'Portfolio Score',
      value: '78/100',
      sub: 'Good diversification',
      icon: Activity,
      color: 'text-blue-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</span>
            <stat.icon size={15} className={cn('opacity-60', stat.color)} />
          </div>
          <div>
            <div className={cn('text-xl font-semibold', stat.color)}>{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{stat.sub}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
