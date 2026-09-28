import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-ink-soft">404</p>
      <h1 className="font-display text-2xl text-ink">This stall doesn't exist</h1>
      <p className="text-sm text-ink-soft">The page you're looking for isn't part of the market.</p>
      <Link to="/" className="mt-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft">
        Back to the market
      </Link>
    </div>
  )
}
