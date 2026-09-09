// AllocationChart — donut chart showing portfolio distribution
// Data comes directly from the Zustand store, always reflects current prices
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { formatCurrency, formatPercent, isPositive } from '@/lib/utils'
import { cn } from '@/lib/utils'

// One color per asset — cycles if there are more than 8 assets
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316']

// Colors for the asset type breakdown (stock / etf / crypto)
const TYPE_COLORS: Record<string, string> = {
  stock:  '#3b82f6',
  etf:    '#8b5cf6',
  crypto: '#f59e0b',
}

interface TooltipProps {
  active?: boolean
  payload?: { payload: { ticker: string; name: string; value: number; percentage: number; pnlPercent: number } }[]
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const pos = isPositive(d.pnlPercent)

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <div className="font-mono font-semibold text-zinc-100 mb-1">{d.ticker}</div>
      <div className="text-zinc-400">{formatCurrency(d.value)}</div>
      <div className="text-zinc-500">{d.percentage.toFixed(1)}% of portfolio</div>
      <div className={cn('mt-1 font-mono', pos ? 'text-emerald-400' : 'text-red-400')}>
        {formatPercent(d.pnlPercent)}
      </div>
    </div>
  )
}

export function AllocationChart() {
  const { allocation, byType, totalValue } = usePortfolioMetrics()

  // Build type breakdown data for the small summary below the chart
  const typeBreakdown = Object.entries(byType).map(([type, value]) => ({
    type,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
        <span className="text-xs text-zinc-600 font-mono">{formatCurrency(totalValue)}</span>
      </CardHeader>

      {/* Donut chart */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={allocation}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {allocation.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Per-asset legend */}
      <div className="space-y-1.5 mt-2">
        {allocation.map((item, i) => (
          <div key={item.ticker} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="font-mono text-zinc-300">{item.ticker}</span>
              <span className="text-zinc-600">{item.name.split(' ')[0]}</span>
            </div>
            <span className="text-zinc-500 font-mono">{item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Asset type breakdown — Stock / ETF / Crypto */}
      {typeBreakdown.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 mb-2 font-medium">By type</div>
          <div className="flex gap-2">
            {typeBreakdown.map(({ type, percentage }) => (
              <div key={type} className="flex-1">
                {/* Filled bar per type */}
                <div className="h-1 rounded-full mb-1.5 overflow-hidden bg-zinc-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      background: TYPE_COLORS[type] || '#71717a',
                    }}
                  />
                </div>
                <div className="text-[10px] capitalize" style={{ color: TYPE_COLORS[type] || '#71717a' }}>
                  {type}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">{percentage.toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}