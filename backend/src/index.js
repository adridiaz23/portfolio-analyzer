// Express server — acts as a proxy between the React frontend and external price APIs
// The browser can't call Yahoo Finance directly due to CORS restrictions
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fetchStockPrices } from './services/yahooFinance.js'
import { fetchCryptoPrices, isCryptoTicker } from './services/coinGecko.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Allow requests from the React frontend only
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── GET /api/prices?tickers=AAPL,VOO,BTC,ETH ────────────────────────────────
// Main price endpoint — accepts a comma-separated list of tickers
// Automatically routes each ticker to Yahoo Finance or CoinGecko
app.get('/api/prices', async (req, res) => {
  const raw = req.query.tickers
  if (!raw) {
    return res.status(400).json({ error: 'Missing tickers query parameter' })
  }

  // Split and clean the ticker list
  const tickers = raw
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean)

  if (tickers.length === 0) {
    return res.status(400).json({ error: 'No valid tickers provided' })
  }

  // Separate crypto tickers from stock/ETF tickers
  const cryptoTickers = tickers.filter(isCryptoTicker)
  const stockTickers  = tickers.filter((t) => !isCryptoTicker(t))

  try {
    // Fetch both sources in parallel
    const [stockPrices, cryptoPrices] = await Promise.all([
      stockTickers.length  > 0 ? fetchStockPrices(stockTickers)   : {},
      cryptoTickers.length > 0 ? fetchCryptoPrices(cryptoTickers) : {},
    ])

    // Merge results into a single response object
    const prices = { ...stockPrices, ...cryptoPrices }

    // Report which tickers we couldn't find a price for
    const missing = tickers.filter((t) => !prices[t])

    res.json({ prices, missing, timestamp: new Date().toISOString() })

  } catch (err) {
    console.error('[/api/prices] Unexpected error:', err)
    res.status(500).json({ error: 'Failed to fetch prices' })
  }
})

// ─── POST /api/analyze — Claude AI analysis (Day 8) ──────────────────────────
app.post('/api/analyze', async (req, res) => {
  res.status(501).json({ message: 'Coming in Day 8' })
})

app.listen(PORT, () => {
  console.log(`Backend running → http://localhost:${PORT}`)
})