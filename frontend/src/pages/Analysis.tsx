import { Card } from '@/components/ui/Card'
import { BarChart3 } from 'lucide-react'

export function Analysis() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Analysis</h1>
        <p className="text-sm text-zinc-500 mt-1">Deep dive into your portfolio metrics</p>
      </div>
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <BarChart3 size={40} className="text-zinc-700 mb-4" />
        <p className="text-zinc-500 text-sm">Coming in Day 4 — Metrics, Sharpe ratio, volatility & more</p>
      </Card>
    </div>
  )
}
