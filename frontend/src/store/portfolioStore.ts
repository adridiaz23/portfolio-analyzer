import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Asset, AssetType } from '@/types'
import { generateId } from '@/lib/utils'

interface PortfolioState {
  assets: Asset[]
  addAsset: (asset: Omit<Asset, 'id' | 'currentPrice'>) => void
  removeAsset: (id: string) => void
  updatePrice: (ticker: string, price: number) => void
  updateAllPrices: (prices: Record<string, number>) => void
}

const DEMO_ASSETS: Asset[] = [
  { id: '1', ticker: 'AAPL', name: 'Apple Inc.', type: 'stock', quantity: 10, buyPrice: 150, currentPrice: 189.30, currency: 'USD' },
  { id: '2', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'etf', quantity: 5, buyPrice: 400, currentPrice: 495.20, currency: 'USD' },
  { id: '3', ticker: 'BTC', name: 'Bitcoin', type: 'crypto', quantity: 0.15, buyPrice: 42000, currentPrice: 67500, currency: 'USD' },
  { id: '4', ticker: 'MSFT', name: 'Microsoft Corp.', type: 'stock', quantity: 8, buyPrice: 310, currentPrice: 445.60, currency: 'USD' },
  { id: '5', ticker: 'ETH', name: 'Ethereum', type: 'crypto', quantity: 2, buyPrice: 2200, currentPrice: 3580, currency: 'USD' },
]

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      assets: DEMO_ASSETS,

      addAsset: (assetData) => {
        const newAsset: Asset = {
          ...assetData,
          id: generateId(),
          currentPrice: assetData.buyPrice,
        }
        set((state) => ({ assets: [...state.assets, newAsset] }))
      },

      removeAsset: (id) => {
        set((state) => ({ assets: state.assets.filter((a) => a.id !== id) }))
      },

      updatePrice: (ticker, price) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.ticker === ticker ? { ...a, currentPrice: price } : a
          ),
        }))
      },

      updateAllPrices: (prices) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            prices[a.ticker] ? { ...a, currentPrice: prices[a.ticker] } : a
          ),
        }))
      },
    }),
    { name: 'portfolio-storage' }
  )
)

export function usePortfolioMetrics() {
  const assets = usePortfolioStore((s) => s.assets)

  const totalInvested = assets.reduce((sum, a) => sum + a.buyPrice * a.quantity, 0)
  const totalValue = assets.reduce((sum, a) => sum + a.currentPrice * a.quantity, 0)
  const totalPnL = totalValue - totalInvested
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  const byType = assets.reduce(
    (acc, a) => {
      const value = a.currentPrice * a.quantity
      acc[a.type] = (acc[a.type] || 0) + value
      return acc
    },
    {} as Record<AssetType, number>
  )

  const allocation = assets.map((a) => ({
    ticker: a.ticker,
    name: a.name,
    type: a.type,
    value: a.currentPrice * a.quantity,
    percentage: totalValue > 0 ? ((a.currentPrice * a.quantity) / totalValue) * 100 : 0,
    pnl: (a.currentPrice - a.buyPrice) * a.quantity,
    pnlPercent: a.buyPrice > 0 ? ((a.currentPrice - a.buyPrice) / a.buyPrice) * 100 : 0,
  }))

  return { assets, totalInvested, totalValue, totalPnL, totalPnLPercent, byType, allocation }
}
