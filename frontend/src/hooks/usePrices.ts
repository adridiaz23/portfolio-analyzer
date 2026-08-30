// usePrices — fetches real prices for all portfolio assets and keeps them updated
// Polls the backend every 60 seconds so prices stay fresh without manual refresh
import { useState, useEffect, useCallback } from 'react'
import { fetchPrices } from '@/services/priceService'
import { usePortfolioStore } from '@/store/portfolioStore'

interface UsePricesReturn {
  isLoading: boolean
  isError: boolean
  lastUpdated: Date | null
  refresh: () => void
}

// How often to automatically refresh prices (in milliseconds)
const REFRESH_INTERVAL_MS = 60 * 1000

export function usePrices(): UsePricesReturn {
  const assets = usePortfolioStore((s) => s.assets)
  const updateAllPrices = usePortfolioStore((s) => s.updateAllPrices)

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    if (assets.length === 0) return

    // Get unique tickers from the portfolio
    const tickers = [...new Set(assets.map((a) => a.ticker))]

    setIsLoading(true)
    setIsError(false)

    try {
      const { prices } = await fetchPrices(tickers)

      // Convert the response into the format the store expects: { AAPL: 189.5, BTC: 67000 }
      const priceMap: Record<string, number> = {}
      for (const [ticker, data] of Object.entries(prices)) {
        priceMap[ticker] = data.price
      }

      updateAllPrices(priceMap)
      setLastUpdated(new Date())

    } catch (err) {
      console.error('[usePrices] Failed to fetch prices:', err)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [assets, updateAllPrices])

  // Fetch on first render
  useEffect(() => {
    refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Then refresh automatically every 60 seconds
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [refresh])

  return { isLoading, isError, lastUpdated, refresh }
}