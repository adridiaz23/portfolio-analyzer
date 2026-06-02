import { cn } from '@/lib/utils'
import type { AssetType } from '@/types'

interface BadgeProps {
  type: AssetType
  className?: string
}

const config: Record<AssetType, { label: string; className: string }> = {
  stock: { label: 'Stock', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  etf: { label: 'ETF', className: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
  crypto: { label: 'Crypto', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
}

export function AssetBadge({ type, className }: BadgeProps) {
  const { label, className: typeClass } = config[type]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', typeClass, className)}>
      {label}
    </span>
  )
}
