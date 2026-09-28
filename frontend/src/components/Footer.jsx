import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-xs text-sm text-ink-soft">
            A marketplace of independent sellers, each running their own stall.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-ink">Shop</span>
            <Link to="/products" className="text-ink-soft hover:text-ink">Browse products</Link>
            <Link to="/orders" className="text-ink-soft hover:text-ink">Track an order</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-ink">Sell</span>
            <Link to="/register" className="text-ink-soft hover:text-ink">Open a stall</Link>
            <Link to="/seller" className="text-ink-soft hover:text-ink">Seller dashboard</Link>
          </div>
        </div>
      </div>
      <div className="tear-rule" />
      <p className="px-4 py-4 text-center text-xs text-ink-soft sm:px-6">
        Demo storefront for a local multi-vendor marketplace backend. Payments are simulated.
      </p>
    </footer>
  )
}
