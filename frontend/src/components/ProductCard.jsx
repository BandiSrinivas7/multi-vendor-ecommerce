import { Link } from 'react-router-dom'
import { formatPrice, stallColorFor } from '../utils/format'

export default function ProductCard({ product }) {
  const tone = stallColorFor(product.category)

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-md"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: `var(--color-${tone})` }} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium" style={{ color: `var(--color-${tone}-dark)` }}>
          {product.category}
        </span>
        <h3 className="font-display text-lg leading-snug text-ink group-hover:underline">
          {product.name}
        </h3>
        {product.description ? (
          <p className="line-clamp-2 text-sm text-ink-soft">{product.description}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-base font-semibold text-ink">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  )
}
