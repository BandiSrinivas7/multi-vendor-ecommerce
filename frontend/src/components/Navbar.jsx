import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function submitSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    navigate(`/products?${params.toString()}`)
  }

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo dark />
        </Link>

        <form onSubmit={submitSearch} className="hidden flex-1 items-center sm:flex">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the market for anything…"
            className="w-full rounded-l-md border border-ink-soft bg-ink px-3 py-1.5 text-sm text-paper placeholder:text-paper/50 focus:border-marigold"
          />
          <button
            type="submit"
            className="rounded-r-md border border-l-0 border-marigold bg-marigold px-3 py-1.5 text-sm font-medium text-ink hover:bg-marigold-dark hover:text-paper"
          >
            Search
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link to="/products" className="hidden hover:text-marigold sm:inline">
            Browse
          </Link>

          <Link to="/cart" className="relative hover:text-marigold" aria-label="Cart">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-marigold px-1 font-mono text-[10px] font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1 hover:text-marigold"
              >
                {user.email.split('@')[0]}
                <ChevronIcon />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-line bg-white py-1 text-ink shadow-lg">
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-paper-dim">
                    My orders
                  </Link>
                  {user.role === 'SELLER' && (
                    <Link to="/seller" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-paper-dim">
                      Seller dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-berry-dark hover:bg-paper-dim"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="rounded-md border border-marigold px-3 py-1.5 font-medium text-marigold hover:bg-marigold hover:text-ink"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>

      <form onSubmit={submitSearch} className="flex items-center px-4 pb-3 sm:hidden">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the market…"
          className="w-full rounded-l-md border border-ink-soft bg-ink px-3 py-1.5 text-sm text-paper placeholder:text-paper/50"
        />
        <button type="submit" className="rounded-r-md border border-l-0 border-marigold bg-marigold px-3 py-1.5 text-sm font-medium text-ink">
          Go
        </button>
      </form>
    </header>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M1 1h4l2.4 12.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
