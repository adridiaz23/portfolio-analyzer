import { useState } from 'react'
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
import { PortfolioTable } from '@/components/portfolio/PortfolioTable'
import { AddAssetModal } from '@/components/portfolio/AddAssetModal'
import { AllocationChart } from '@/components/charts/AllocationChart'
import { PerformanceChart } from '@/components/charts/PerformanceChart'

export function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Portfolio Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">Track your investments across stocks, ETFs and crypto</p>
      </div>

      <PortfolioSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <AllocationChart />
      </div>

      <PortfolioTable onAddAsset={() => setShowAddModal(true)} />

      {showAddModal && <AddAssetModal onClose={() => setShowAddModal(false)} />}
    </>
  )
}
