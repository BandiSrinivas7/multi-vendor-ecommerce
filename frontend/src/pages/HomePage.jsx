import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../api/products'
import { listCategories } from '../api/categories'
import ProductCard from '../components/ProductCard'
import { CardSkeleton } from '../components/Feedback'
import { stallColorFor } from '../utils/format'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState(null)

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]))
    listProducts({ page: 0, size: 8 })
      .then((data) => setProducts(data.content || []))
      .catch(() => setProducts([]))
  }, [])

  return (
    <div className="flex flex-col">
      <section className="border-b border-line bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              One market, hundreds of independent stalls.
            </h1>
            <p className="max-w-md text-base text-paper/75">
              Every listing here is run by its own seller — priced, stocked, and shipped by them, not by us.
              Browse the whole market or go straight to a category.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-md bg-marigold px-5 py-2.5 font-medium text-ink hover:bg-marigold-dark hover:text-paper"
              >
                Browse the market
              </Link>
              <Link
                to="/register?role=seller"
                className="rounded-md border border-paper/40 px-5 py-2.5 font-medium text-paper hover:border-paper"
              >
                Open a stall
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(categories.length ? categories : Array.from({ length: 4 })).slice(0, 4).map((c, i) => (
              <CategoryTile key={c?.id || i} category={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-ink">Fresh at the market</h2>
          <Link to="/products" className="text-sm font-medium text-ink underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products === null
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : products.length === 0
              ? (
                <p className="col-span-full py-10 text-center text-ink-soft">
                  No products are listed yet — check back once a seller activates their first item.
                </p>
              )
              : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="mb-8 font-display text-2xl text-ink">Opening a stall takes three steps</h2>
          <ol className="grid gap-8 sm:grid-cols-3">
            <Step n={1} title="Apply">
              Register as a seller and tell us your business name. Your stall starts in review.
            </Step>
            <Step n={2} title="Stock a listing">
              Once approved, list a product, set its price, and add stock.
            </Step>
            <Step n={3} title="Activate & sell">
              Activate the listing and it appears on the market for every customer to find.
            </Step>
          </ol>
        </div>
      </section>
    </div>
  )
}

function CategoryTile({ category }) {
  if (!category) {
    return <div className="h-24 animate-pulse rounded-lg bg-paper/10" />
  }
  const tone = stallColorFor(category.name)
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="flex h-24 flex-col justify-end rounded-lg border border-paper/15 p-4 transition-colors hover:border-paper/40"
      style={{ backgroundColor: `color-mix(in srgb, var(--color-${tone}) 22%, transparent)` }}
    >
      <span className="font-display text-lg text-paper">{category.name}</span>
    </Link>
  )
}

function Step({ n, title, children }) {
  return (
    <li className="flex flex-col gap-2 border-l-2 border-marigold pl-4">
      <span className="font-mono text-xs text-ink-soft">Step {n}</span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="text-sm text-ink-soft">{children}</p>
    </li>
  )
}
