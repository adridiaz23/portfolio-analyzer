// Root layout — wraps every page with Navbar + page header + content area
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'

// Each route gets its own title and description shown below the navbar
const PAGE_META: Record<string, { title: string; description: string }> = {
  '/':         { title: 'Portfolio Overview', description: 'Track your investments across stocks, ETFs and crypto' },
  '/analysis': { title: 'Analysis',           description: 'Deep dive into your portfolio metrics and risk' },
  '/ai':       { title: 'AI Insights',        description: 'Claude-powered analysis and rebalancing suggestions' },
}

export function Layout() {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? PAGE_META['/']

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="pt-14">
        {/* Page header — title + description strip below navbar */}
        <div className="border-b border-zinc-800/60 bg-zinc-950/60">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <h1 className="text-lg font-semibold text-zinc-100">{meta.title}</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{meta.description}</p>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}