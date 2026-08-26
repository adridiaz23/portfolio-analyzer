// yahooFinance.js — fetches real-time stock and ETF prices from Yahoo Finance
// We use the unofficial query API which is free and requires no API key
import axios from 'axios'

const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart'

// Simple in-memory cache to avoid hitting Yahoo too often
// Each price is cached for 60 seconds
const cache = new Map()
const CACHE_TTL_MS = 60 * 1000

/**
 * Fetch the current price for a single stock or ETF ticker
 * Returns null if the ticker is invalid or the request fails
 */
export async function fetchStockPrice(ticker) {
  const cacheKey = ticker.toUpperCase()

  // Return cached price if it's still fresh
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const response = await axios.get(`${BASE_URL}/${ticker}`, {
      params: {
        interval: '1d',
        range: '1d',
      },
      // Pretend to be a browser so Yahoo doesn't block us
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 8000,
    })

    const result = response.data?.chart?.result?.[0]
    if (!result) return null

    const meta = result.meta
    const price = meta.regularMarketPrice
    const prevClose = meta.previousClose || meta.chartPreviousClose
    const change = price - prevClose
    const changePercent = (change / prevClose) * 100

    const data = {
      ticker: ticker.toUpperCase(),
      price,
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(4)),
      currency: meta.currency || 'USD',
      marketState: meta.marketState, // REGULAR, PRE, POST, CLOSED
    }

    // Save to cache
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data

  } catch (err) {
    console.error(`[Yahoo] Failed to fetch ${ticker}:`, err.message)
    return null
  }
}

/**
 * Fetch prices for multiple tickers at once
 * Runs all requests in parallel for speed
 */
export async function fetchStockPrices(tickers) {
  const results = await Promise.all(tickers.map(fetchStockPrice))

  // Build a map of ticker -> price data, skipping any that failed
  return results.reduce((acc, data) => {
    if (data) acc[data.ticker] = data
    return acc
  }, {})
}