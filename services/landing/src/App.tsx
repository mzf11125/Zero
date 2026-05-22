import { Outlet, Link, useLocation } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 antialiased">
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          isLanding
            ? 'border-transparent bg-transparent'
            : 'border-white/[0.05] bg-black/80 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
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
      <footer className="border-t border-white/[0.05] bg-black py-6 text-center">
        <span className="text-xs text-gray-600">by Daemon Blockint Technologies</span>
      </footer>
    </div>
  )
}
