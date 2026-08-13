// AddAssetModal — form to add a new stock, ETF or crypto to the portfolio
// Uses useAddAssetForm for validation and usePortfolioStore to save the asset
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useAddAssetForm } from '@/hooks/useAddAssetForm'
import type { AssetType } from '@/types'
import { cn } from '@/lib/utils'

interface AddAssetModalProps {
  onClose: () => void
}

// Asset type selector options with examples to help the user
const ASSET_TYPES: { value: AssetType; label: string; examples: string }[] = [
  { value: 'stock',  label: 'Stock',  examples: 'AAPL, MSFT, GOOGL' },
  { value: 'etf',    label: 'ETF',    examples: 'VOO, QQQ, ARKK'    },
  { value: 'crypto', label: 'Crypto', examples: 'BTC, ETH, SOL'     },
]

export function AddAssetModal({ onClose }: AddAssetModalProps) {
  const addAsset = usePortfolioStore((s) => s.addAsset)
  const { form, errors, setField, validate, reset } = useAddAssetForm()

  function handleSubmit() {
    // Stop here if any field fails validation
    if (!validate()) return

    addAsset({
      ticker:    form.ticker.trim().toUpperCase(),
      // If no name provided, fall back to the ticker as the display name
      name:      form.name.trim() || form.ticker.trim().toUpperCase(),
      type:      form.type,
      quantity:  parseFloat(form.quantity),
      buyPrice:  parseFloat(form.buyPrice),
      currency:  'USD',
    })

    reset()
    onClose()
  }

  // Close when clicking the dark backdrop behind the modal
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal panel */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Add Asset</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Enter the details of your investment</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">

          {/* Asset type selector */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Asset Type</label>
            <div className="grid grid-cols-3 gap-2">
              {ASSET_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setField('type', t.value)}
                  className={cn(
                    'p-2.5 rounded-lg border text-left transition-colors',
                    form.type === t.value
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/50'
                  )}
                >
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">{t.examples}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ticker + optional name */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ticker"
              required
              placeholder="AAPL"
              value={form.ticker}
              onChange={(e) => setField('ticker', e.target.value.toUpperCase())}
              error={errors.ticker}
              className="font-mono uppercase"
            />
            <Input
              label="Name"
              placeholder="Apple Inc."
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              hint="Optional"
            />
          </div>

          {/* Quantity + buy price */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity"
              required
              type="number"
              min="0"
              step="any"
              placeholder="10"
              value={form.quantity}
              onChange={(e) => setField('quantity', e.target.value)}
              error={errors.quantity}
              className="font-mono"
            />
            <Input
              label="Buy Price (USD)"
              required
              type="number"
              min="0"
              step="any"
              placeholder="150.00"
              value={form.buyPrice}
              onChange={(e) => setField('buyPrice', e.target.value)}
              error={errors.buyPrice}
              hint={form.quantity && form.buyPrice
                ? `Total: $${(parseFloat(form.quantity) * parseFloat(form.buyPrice)).toFixed(2)}`
                : undefined
              }
              className="font-mono"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Add to Portfolio
          </Button>
        </div>
      </div>
    </div>
  )
}