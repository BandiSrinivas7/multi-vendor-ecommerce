import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, listReviews, addReview } from '../api/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../api/client'
import { formatPrice, stallColorFor } from '../utils/format'
import RatingStars from '../components/RatingStars'
import { Spinner, EmptyState } from '../components/Feedback'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const toast = useToast()

  const [product, setProduct] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setProduct(null)
    setNotFound(false)
    getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
    listReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [id])

  async function handleAddToCart() {
    if (!isAuthenticated) {
      toast.info('Sign in to add items to your cart.')
      return
    }
    setAdding(true)
    try {
      await addItem(id, qty)
      toast.success(`Added ${qty} × ${product.name} to your cart.`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add this to your cart.'))
    } finally {
      setAdding(false)
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="This listing isn't here anymore"
          description="It may have been removed by its seller."
          action={
            <Link to="/products" className="text-sm font-medium text-ink underline">
              Back to the market
            </Link>
          }
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    )
  }

  const tone = stallColorFor(product.category)
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link to="/products" className="hover:text-ink">Market</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div
          className="flex aspect-square items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in srgb, var(--color-${tone}) 14%, var(--color-paper-dim))` }}
        >
          <span className="font-display text-3xl" style={{ color: `var(--color-${tone}-dark)` }}>
            {product.category}
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-sm font-medium" style={{ color: `var(--color-${tone}-dark)` }}>
              {product.category}
            </span>
            <h1 className="mt-1 font-display text-3xl text-ink">{product.name}</h1>
            {reviews.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <RatingStars value={Math.round(avgRating)} />
                <span className="text-sm text-ink-soft">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? '' : 's'})
                </span>
              </div>
            )}
          </div>

          <p className="font-mono text-2xl font-semibold text-ink">{formatPrice(product.price)}</p>

          {product.description ? <p className="text-ink-soft">{product.description}</p> : null}

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center rounded-md border border-line">
              <button
                type="button"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="px-3 py-2 text-ink-soft hover:text-ink"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center font-mono text-sm">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((n) => n + 1)}
                className="px-3 py-2 text-ink-soft hover:text-ink"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
            >
              {adding && <Spinner size={16} />}
              Add to cart
            </button>
          </div>
          <p className="text-xs text-ink-soft">
            Stock is confirmed at checkout — if a seller has sold out, you'll see that before you pay.
          </p>
        </div>
      </div>

      <ReviewsSection productId={id} reviews={reviews} setReviews={setReviews} isAuthenticated={isAuthenticated} />
    </div>
  )
}

function ReviewsSection({ productId, reviews, setReviews, isAuthenticated }) {
  const toast = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submitReview(e) {
    e.preventDefault()
    if (!rating) {
      setError('Choose a star rating first.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const review = await addReview(productId, { rating, comment })
      setReviews((r) => [review, ...r])
      setRating(0)
      setComment('')
      toast.success('Thanks for reviewing this listing.')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not submit your review.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="mb-6 font-display text-2xl text-ink">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="mb-8 text-sm text-ink-soft">No reviews yet — be the first to weigh in.</p>
      ) : (
        <ul className="mb-10 flex flex-col gap-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-line bg-white p-4">
              <RatingStars value={r.rating} size={14} />
              {r.comment ? <p className="mt-2 text-sm text-ink">{r.comment}</p> : null}
              <p className="mt-2 text-xs text-ink-soft">Verified buyer</p>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <form onSubmit={submitReview} className="flex max-w-lg flex-col gap-3 rounded-lg border border-line bg-white p-5">
          <span className="text-sm font-medium text-ink">Leave a review</span>
          <RatingStars value={rating} onChange={setRating} size={22} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="What did you think?"
            className="rounded-md border border-line px-3 py-2 text-sm focus:border-ink"
          />
          {error ? <p className="text-sm text-berry-dark">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            Submit review
          </button>
        </form>
      ) : (
        <p className="text-sm text-ink-soft">
          <Link to="/login" className="font-medium text-ink underline">Sign in</Link> to leave a review.
        </p>
      )}
    </section>
  )
}
