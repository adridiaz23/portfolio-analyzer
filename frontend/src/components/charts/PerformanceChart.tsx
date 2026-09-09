// PerformanceChart — area chart showing portfolio value over time
// Uses real buy prices and current prices to simulate a realistic growth curve
// Historical day-by-day data will be added in Day 9 when we connect price history APIs
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { formatCurrency, isPositive } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * Build a simulated 12-month performance curve
 * Starts from total invested value and ends at current portfolio value
 * The curve isn't perfectly accurate but gives a realistic visual shape
 */
function buildPerformanceData(totalInvested: number, totalValue: number) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const currentMonth = now.getMonth() // 0-indexed

  // Build 12 data points from oldest to newest month
  const data = []
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i + 12) % 12
    // Progress goes from 0 (12 months ago) to 1 (now)
    const progress = i / 11
    // Interpolate between invested amount and current value with slight curve
    const curve = Math.pow(progress, 0.8)
    // Add small random noise so it looks like a real chart, not a straight line
    const noise = (Math.random() - 0.5) * (totalInvested * 0.03)
    const value = totalInvested + (totalValue - totalInvested) * curve + noise

    data.push({
      month: months[monthIndex],
      value: Math.max(0, Math.round(value)),
    })
  }

  // Make sure the last point is exactly the current value
  data[11].value = Math.round(totalValue)
  return data
}

interface TooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-zinc-400 mb-1">{label}</div>
      <div className="font-mono font-semibold text-zinc-100">{formatCurrency(payload[0].value)}</div>
    </div>
  )
}

export function PerformanceChart() {
  const { totalInvested, totalValue, totalPnL, totalPnLPercent } = usePortfolioMetrics()
  const positive = isPositive(totalPnL)
  const lineColor = positive ? '#10b981' : '#f87171'

  const data = buildPerformanceData(totalInvested, totalValue)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance (12m)</CardTitle>
        {/* P&L summary next to the title */}
        <div className="flex items-center gap-3">
          <span className={cn('text-sm font-mono font-medium', positive ? 'text-emerald-400' : 'text-red-400')}>
            {positive ? '+' : ''}{formatCurrency(totalPnL)}
          </span>
          <span className={cn('text-xs font-mono px-2 py-0.5 rounded-full', positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
            {positive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </span>
        </div>
      </CardHeader>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {/* Gradient fill under the area line */}
            <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0}    />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            tick={{ fill: '#52525b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#52525b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />

          {/* Horizontal reference line at the invested amount */}
          <ReferenceLine
            y={totalInvested}
            stroke="#3f3f46"
            strokeDasharray="4 4"
            label={{ value: 'Cost basis', fill: '#52525b', fontSize: 10, position: 'insideTopLeft' }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fill="url(#perfGradient)"
            dot={false}
            activeDot={{ r: 4, fill: lineColor, stroke: 'transparent' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Cost basis note */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
        <span>Cost basis: {formatCurrency(totalInvested)}</span>
        <span>Current: {formatCurrency(totalValue)}</span>
      </div>
    </Card>
  )
}