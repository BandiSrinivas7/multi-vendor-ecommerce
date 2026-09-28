import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listProducts } from '../api/products'
import { listCategories } from '../api/categories'
import ProductCard from '../components/ProductCard'
import { CardSkeleton, EmptyState } from '../components/Feedback'
import Pagination from '../components/Pagination'

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const page = parseInt(params.get('page') || '0', 10)

  const [categories, setCategories] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    listProducts({ page, size: 24, q: q || undefined })
      .then(setResult)
      .catch(() => setError('Could not load products right now.'))
      .finally(() => setLoading(false))
  }, [q, page])

  function updateParams(next) {
    const merged = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => {
      if (v) merged.set(k, v)
      else merged.delete(k)
    })
    setParams(merged)
  }

  const content = result?.content || []
  // The public products endpoint doesn't support filtering by category
  // server-side, so category filtering narrows down the current page's
  // results rather than searching the whole catalog.
  const visible = category ? content.filter((p) => p.category === category) : content
  const totalPages = result?.totalPages ?? 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl text-ink">{q ? `Results for “${q}”` : 'Every stall in the market'}</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={!category} onClick={() => updateParams({ category: '', page: '' })}>
          All stalls
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={category === c.name} onClick={() => updateParams({ category: c.name, page: '' })}>
            {c.name}
          </FilterChip>
        ))}
      </div>
      {category ? (
        <p className="-mt-3 mb-6 text-xs text-ink-soft">
          Showing {category} listings on this page. Switch pages below to see more of the market.
        </p>
      ) : null}

      {error ? (
        <EmptyState title="Something went wrong" description={error} />
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="No listings here yet"
          description={q ? 'Try a different search term.' : 'This stall is still stocking up — check back soon.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: String(p) })} />
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ' +
        (active ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink-soft hover:border-ink hover:text-ink')
      }
    >
      {children}
    </button>
  )
}
