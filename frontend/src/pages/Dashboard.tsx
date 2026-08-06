// Dashboard — main page, composes all portfolio components
import { useState } from 'react'
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
import { PortfolioTable } from '@/components/portfolio/PortfolioTable'
import { AddAssetModal } from '@/components/portfolio/AddAssetModal'
import { AllocationChart } from '@/components/charts/AllocationChart'
import { PerformanceChart } from '@/components/charts/PerformanceChart'

export function Dashboard() {
  // Controls whether the "Add Asset" modal is open
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <>
      {/* Top metrics */}
      <PortfolioSummary />

      {/* Charts row — performance history + allocation breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <AllocationChart />
      </div>

      {/* Full holdings table */}
      <PortfolioTable onAddAsset={() => setShowAddModal(true)} />

      {/* Modal — rendered at root level to overlay everything */}
      {showAddModal && (
        <AddAssetModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  )
}