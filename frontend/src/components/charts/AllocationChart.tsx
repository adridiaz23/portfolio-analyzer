import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePortfolioMetrics } from '@/store/portfolioStore'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <div className="font-mono font-semibold text-zinc-100">{d.ticker}</div>
        <div className="text-zinc-400">{formatCurrency(d.value)}</div>
        <div className="text-zinc-500">{d.percentage.toFixed(1)}%</div>
      </div>
    )
  }
  return null
}

export function AllocationChart() {
  const { allocation } = usePortfolioMetrics()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={allocation}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {allocation.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 mt-2">
        {allocation.map((item, i) => (
          <div key={item.ticker} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="font-mono text-zinc-300">{item.ticker}</span>
            </div>
            <span className="text-zinc-500">{item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
