import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Price endpoint — Yahoo Finance proxy (Day 3)
app.get('/api/prices/:tickers', async (req, res) => {
  res.json({ message: 'Coming in Day 3', tickers: req.params.tickers })
})

// Claude AI analysis endpoint (Day 4)
app.post('/api/analyze', async (req, res) => {
  res.json({ message: 'Coming in Day 4' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
