// coinGecko.js — fetches real-time crypto prices from CoinGecko's free API
// Free tier allows 30 calls/minute — cache keeps us well within that limit
import axios from 'axios'

const BASE_URL = 'https://api.coingecko.com/api/v3'

// Map common crypto tickers to their CoinGecko IDs
// CoinGecko uses full names as IDs, not ticker symbols
const TICKER_TO_ID = {
  BTC:  'bitcoin',
  ETH:  'ethereum',
  SOL:  'solana',
  BNB:  'binancecoin',
  XRP:  'ripple',
  ADA:  'cardano',
  DOGE: 'dogecoin',
  DOT:  'polkadot',
  MATIC:'matic-network',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI:  'uniswap',
  LTC:  'litecoin',
  ATOM: 'cosmos',
  FTM:  'fantom',
}

// Cache crypto prices for 60 seconds — same TTL as stocks
const cache = new Map()
const CACHE_TTL_MS = 60 * 1000

/**
 * Convert a ticker symbol to a CoinGecko ID
 * Returns null if the ticker is not in our map
 */
function tickerToId(ticker) {
  return TICKER_TO_ID[ticker.toUpperCase()] || null
}

/**
 * Fetch prices for multiple crypto tickers in one API call
 * CoinGecko supports batch requests which is more efficient
 */
export async function fetchCryptoPrices(tickers) {
  const upperTickers = tickers.map((t) => t.toUpperCase())

  // Check cache first — return cached data for all tickers that are still fresh
  const now = Date.now()
  const cachedResults = {}
  const tickersToFetch = []

  for (const ticker of upperTickers) {
    const cached = cache.get(ticker)
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      cachedResults[ticker] = cached.data
    } else {
      tickersToFetch.push(ticker)
    }
  }

  // If everything was cached, return immediately
  if (tickersToFetch.length === 0) return cachedResults

  // Convert tickers to CoinGecko IDs, skipping unknown ones
  const ids = tickersToFetch
    .map((t) => tickerToId(t))
    .filter(Boolean)

  if (ids.length === 0) return cachedResults

  try {
    const response = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: ids.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true,
      },
      timeout: 8000,
    })

    const rawData = response.data

    // Map CoinGecko response back to our ticker format
    for (const ticker of tickersToFetch) {
      const id = tickerToId(ticker)
      if (!id || !rawData[id]) continue

      const coinData = rawData[id]
      const data = {
        ticker,
        price: coinData.usd,
        change: 0, // CoinGecko free tier gives % change but not absolute
        changePercent: parseFloat((coinData.usd_24h_change || 0).toFixed(4)),
        currency: 'USD',
        marketState: 'REGULAR', // Crypto trades 24/7
      }

      cache.set(ticker, { data, timestamp: now })
      cachedResults[ticker] = data
    }

    return cachedResults

  } catch (err) {
    console.error('[CoinGecko] Failed to fetch prices:', err.message)
    return cachedResults // Return whatever we had cached even if fresh fetch failed
  }
}

/**
 * Check whether a ticker is a known crypto symbol
 */
export function isCryptoTicker(ticker) {
  return ticker.toUpperCase() in TICKER_TO_ID
}