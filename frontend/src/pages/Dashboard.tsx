// Dashboard — main page, fetches live prices on mount and every 60 seconds
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
import { PortfolioTable } from '@/components/portfolio/PortfolioTable'
import { AddAssetModal } from '@/components/portfolio/AddAssetModal'
import { AllocationChart } from '@/components/charts/AllocationChart'
import { PerformanceChart } from '@/components/charts/PerformanceChart'
import { usePrices } from '@/hooks/usePrices'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { isLoading, isError, lastUpdated, refresh } = usePrices()

  return (
    <>
      {/* Status bar — shows last update time and any errors */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {isError && (
            <span className="text-amber-400">
              ⚠ Could not fetch live prices — showing last known values
            </span>
          )}
          {!isError && lastUpdated && (
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Manual refresh button */}
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={cn(isLoading && 'animate-spin')} />
          {isLoading ? 'Refreshing...' : 'Refresh prices'}
        </button>
      </div>

      {/* Top metrics */}
      <PortfolioSummary />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <AllocationChart />
      </div>

      {/* Holdings table */}
      <PortfolioTable onAddAsset={() => setShowAddModal(true)} />

      {showAddModal && (
        <AddAssetModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  )
}