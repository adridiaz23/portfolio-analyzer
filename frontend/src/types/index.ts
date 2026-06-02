export type AssetType = 'stock' | 'etf' | 'crypto'

export interface Asset {
  id: string
  ticker: string
  name: string
  type: AssetType
  quantity: number
  buyPrice: number
  currentPrice: number
  currency: string
}

export interface PortfolioSummaryData {
  totalInvested: number
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  dayChange: number
  dayChangePercent: number
}

export interface AllocationItem {
  ticker: string
  name: string
  type: AssetType
  value: number
  percentage: number
  pnl: number
  pnlPercent: number
}

export interface PriceData {
  ticker: string
  price: number
  change: number
  changePercent: number
  currency: string
}
