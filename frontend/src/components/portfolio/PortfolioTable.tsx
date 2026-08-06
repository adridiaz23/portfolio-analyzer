// PortfolioTable — full holdings list with quantity, prices, P&L and allocation bar
import { Trash2, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { AssetBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency, formatPercent, isPositive } from '@/lib/utils'
import { usePortfolioStore, usePortfolioMetrics } from '@/store/portfolioStore'
import { cn } from '@/lib/utils'

interface PortfolioTableProps {
  onAddAsset: () => void
}

const COL_HEADERS = ['Asset', 'Type', 'Qty', 'Buy Price', 'Current', 'Value', 'P&L', 'Weight', '']

export function PortfolioTable({ onAddAsset }: PortfolioTableProps) {
  const removeAsset = usePortfolioStore((s) => s.removeAsset)
  const { allocation, assets } = usePortfolioMetrics()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings ({assets.length})</CardTitle>
        <Button size="sm" onClick={onAddAsset}>
          <Plus size={13} />
          Add Asset
        </Button>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {COL_HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-left text-xs text-zinc-500 font-medium pb-3 pr-4 last:pr-0 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/50">
            {allocation.map((item) => {
              // Find the original asset to get quantity and buy price
              const asset = assets.find((a) => a.ticker === item.ticker)
              const pos = isPositive(item.pnl)

              return (
                <tr
                  key={item.ticker}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* Ticker + name */}
                  <td className="py-3 pr-4">
                    <div className="font-mono font-semibold text-zinc-100 text-sm">
                      {item.ticker}
                    </div>
                    <div className="text-xs text-zinc-500 truncate max-w-[130px]">
                      {item.name}
                    </div>
                  </td>

                  {/* Asset type badge */}
                  <td className="py-3 pr-4">
                    <AssetBadge type={item.type} />
                  </td>

                  {/* Quantity */}
                  <td className="py-3 pr-4 text-zinc-300 font-mono text-xs">
                    {asset?.quantity ?? '—'}
                  </td>

                  {/* Buy price */}
                  <td className="py-3 pr-4 text-zinc-400 font-mono text-xs">
                    {asset ? formatCurrency(asset.buyPrice) : '—'}
                  </td>

                  {/* Current price */}
                  <td className="py-3 pr-4 text-zinc-200 font-mono text-xs">
                    {asset ? formatCurrency(asset.currentPrice) : '—'}
                  </td>

                  {/* Total value */}
                  <td className="py-3 pr-4 text-zinc-100 font-mono text-xs font-medium">
                    {formatCurrency(item.value)}
                  </td>

                  {/* P&L — percent + absolute */}
                  <td className="py-3 pr-4">
                    <div className={cn('flex items-center gap-1 font-mono text-xs font-medium', pos ? 'text-emerald-400' : 'text-red-400')}>
                      {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {formatPercent(item.pnlPercent)}
                    </div>
                    <div className={cn('text-xs mt-0.5 font-mono', pos ? 'text-emerald-400/60' : 'text-red-400/60')}>
                      {pos ? '+' : ''}{formatCurrency(item.pnl)}
                    </div>
                  </td>

                  {/* Allocation weight bar */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-14 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Delete button — only visible on row hover */}
                  <td className="py-3">
                    <button
                      onClick={() => removeAsset(item.ticker)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-700 hover:text-red-400"
                      title="Remove asset"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Empty state */}
        {allocation.length === 0 && (
          <div className="text-center py-16 text-zinc-600 text-sm">
            No assets yet.{' '}
            <button onClick={onAddAsset} className="text-emerald-500 hover:underline">
              Add your first asset
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}