import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight text-purple-400 hover:text-purple-300 transition-colors">
            Zero
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link to="/" className="text-gray-400 hover:text-gray-200 transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-200 transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        Zero — Autonomous agent for the OOBE x Ace Data Cloud bounty
      </footer>
    </div>
  )
}
