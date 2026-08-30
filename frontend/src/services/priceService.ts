// priceService.ts — calls our backend to get real-time prices
// The backend acts as a proxy to Yahoo Finance and CoinGecko
import axios from 'axios'
import type { PriceData } from '@/types'

// In development this hits localhost:3001 via the Vite proxy
// In production it will use the Railway backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface PriceResponse {
  prices: Record<string, PriceData>
  missing: string[]
  timestamp: string
}

/**
 * Fetch current prices for a list of tickers
 * Returns a map of ticker -> price data
 */
export async function fetchPrices(tickers: string[]): Promise<PriceResponse> {
  if (tickers.length === 0) {
    return { prices: {}, missing: [], timestamp: new Date().toISOString() }
  }

  const response = await axios.get<PriceResponse>(`${API_URL}/api/prices`, {
    params: { tickers: tickers.join(',') },
  })

  return response.data
}