import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

// Demo data — will be replaced with real historical data in Day 3
const generateData = () => {
  const data = []
  let value = 18000
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (let i = 0; i < 12; i++) {
    value = value * (1 + (Math.random() * 0.08 - 0.02))
    data.push({ month: months[i], value: Math.round(value) })
  }
  return data
}

const data = generateData()

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <div className="text-zinc-400 mb-1">{label}</div>
        <div className="font-mono font-semibold text-emerald-400">{formatCurrency(payload[0].value)}</div>
      </div>
    )
  }
  return null
}

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance (12m)</CardTitle>
        <span className="text-xs text-zinc-600">Demo data</span>
      </CardHeader>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#colorValue)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
