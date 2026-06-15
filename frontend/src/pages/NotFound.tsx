// 404 — shown when user navigates to a route that doesn't exist
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
        <TrendingUp size={28} className="text-zinc-600" />
      </div>
      <h1 className="text-4xl font-mono font-bold text-zinc-700 mb-2">404</h1>
      <p className="text-zinc-500 text-sm mb-6">This page doesn't exist</p>
      <Link to="/">
        <Button>Back to Portfolio</Button>
      </Link>
    </div>
  )
}