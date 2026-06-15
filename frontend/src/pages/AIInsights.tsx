// AI Insights page — Claude API integration comes after
// For now shows a preview of what the analysis will look like
import { Brain, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { usePortfolioMetrics } from '@/store/portfolioStore'

// Sample insights — will be replaced by real Claude responses 
const SAMPLE_INSIGHTS = [
  {
    icon: Sparkles,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    label: 'Strength',
    text: 'Strong tech exposure through AAPL and MSFT provides solid growth potential.',
  },
  {
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    label: 'Diversification',
    text: 'VOO adds broad market coverage and reduces single-stock risk effectively.',
  },
  {
    icon: Brain,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    label: 'Suggestion',
    text: 'Crypto allocation (BTC + ETH) at ~25% is above recommended 10–15% for moderate risk profiles.',
  },
]

export function AIInsights() {
  const { allocation } = usePortfolioMetrics()

  return (
    <div className="space-y-6">

      {/* CTA card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-100 mb-1">AI Portfolio Analysis</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Claude will analyze your {allocation.length} holdings and provide personalized
              recommendations on diversification, risk exposure, and rebalancing opportunities.
            </p>
          </div>
          {/* Button enabled when Claude API is connected */}
          <Button size="sm" className="flex-shrink-0" disabled>
            <Sparkles size={12} />
            Analyze (Day 8)
          </Button>
        </div>
      </Card>

      {/* Sample insight cards — preview of real output */}
      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
          <Brain size={14} />
          Sample Insights
          <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">Demo</span>
        </h2>
        <div className="space-y-3">
          {SAMPLE_INSIGHTS.map((insight) => (
            <Card key={insight.label} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${insight.bg} flex items-center justify-center flex-shrink-0`}>
                <insight.icon size={14} className={insight.color} />
              </div>
              <div>
                <span className={`text-xs font-semibold ${insight.color} uppercase tracking-wider`}>
                  {insight.label}
                </span>
                <p className="text-sm text-zinc-300 mt-0.5 leading-relaxed">{insight.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Placeholder for real Claude output */}
      <Card className="opacity-40 flex flex-col items-center justify-center py-12 text-center border-dashed">
        <RefreshCw size={28} className="text-zinc-700 mb-3" />
        <p className="text-sm text-zinc-500">Full Claude API analysis coming in Day 8</p>
        <p className="text-xs text-zinc-600 mt-1">Rebalancing suggestions, risk score, sector exposure</p>
      </Card>
    </div>
  )
}