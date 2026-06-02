import { Card } from '@/components/ui/Card'
import { Brain } from 'lucide-react'

export function AIInsights() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">AI Insights</h1>
        <p className="text-sm text-zinc-500 mt-1">Claude-powered portfolio analysis and recommendations</p>
      </div>
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <Brain size={40} className="text-zinc-700 mb-4" />
        <p className="text-zinc-500 text-sm">Coming in Day 4 — AI analysis, rebalancing suggestions & risk assessment</p>
      </Card>
    </div>
  )
}
