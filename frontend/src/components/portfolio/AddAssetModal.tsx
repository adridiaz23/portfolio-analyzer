import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { AssetType } from '@/types'
import { cn } from '@/lib/utils'

interface AddAssetModalProps {
  onClose: () => void
}

const assetTypes: { value: AssetType; label: string; examples: string }[] = [
  { value: 'stock', label: 'Stock', examples: 'AAPL, MSFT, GOOGL' },
  { value: 'etf', label: 'ETF', examples: 'VOO, QQQ, ARKK' },
  { value: 'crypto', label: 'Crypto', examples: 'BTC, ETH, SOL' },
]

export function AddAssetModal({ onClose }: AddAssetModalProps) {
  const addAsset = usePortfolioStore((s) => s.addAsset)
  const [form, setForm] = useState({
    ticker: '',
    name: '',
    type: 'stock' as AssetType,
    quantity: '',
    buyPrice: '',
  })

  const handleSubmit = () => {
    if (!form.ticker || !form.quantity || !form.buyPrice) return
    addAsset({
      ticker: form.ticker.toUpperCase(),
      name: form.name || form.ticker.toUpperCase(),
      type: form.type,
      quantity: parseFloat(form.quantity),
      buyPrice: parseFloat(form.buyPrice),
      currency: 'USD',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-zinc-100">Add Asset</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium mb-2 block">Asset Type</label>
            <div className="grid grid-cols-3 gap-2">
              {assetTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={cn(
                    'p-2.5 rounded-lg border text-xs font-medium transition-colors text-left',
                    form.type === t.value
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  )}
                >
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-zinc-600 mt-0.5 text-[10px]">{t.examples}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Ticker *</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-600"
                placeholder="AAPL"
                value={form.ticker}
                onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Name</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-600"
                placeholder="Apple Inc."
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Quantity *</label>
              <input
                type="number"
                min="0"
                step="any"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-600"
                placeholder="10"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Buy Price (USD) *</label>
              <input
                type="number"
                min="0"
                step="any"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-600"
                placeholder="150.00"
                value={form.buyPrice}
                onChange={(e) => setForm((f) => ({ ...f, buyPrice: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSubmit}>Add to Portfolio</Button>
        </div>
      </div>
    </div>
  )
}
