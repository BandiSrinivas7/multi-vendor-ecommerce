import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../api/client'
import { formatPrice } from '../utils/format'
import { EmptyState, Spinner } from '../components/Feedback'

export default function CartPage() {
  const { items, loading, subtotal, addItem, removeItem } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const [busyId, setBusyId] = useState(null)

  async function increment(item) {
    setBusyId(item.id)
    try {
      await addItem(item.product.id, 1)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update that item.'))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(item) {
    setBusyId(item.id)
    try {
      await removeItem(item.id)
      toast.info(`Removed ${item.product.name}.`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove that item.'))
    } finally {
      setBusyId(null)
    }
  }

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          description="Nothing picked up from the market yet."
          action={
            <Link to="/products" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft">
              Browse the market
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl text-ink">Your cart</h1>

      <div className="rounded-lg border border-line bg-white">
        <ul>
          {items.map((item, i) => (
            <li key={item.id}>
              <div className="flex items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${item.product.id}`} className="font-display text-lg text-ink hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 font-mono text-sm text-ink-soft">
                    {formatPrice(item.product.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-ink-soft">×</span>
                  <span className="w-6 text-center font-mono text-sm text-ink">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increment(item)}
                    disabled={busyId === item.id}
                    className="rounded-md border border-line px-2 py-1 text-sm text-ink-soft hover:border-ink hover:text-ink disabled:opacity-50"
                    aria-label="Add one more"
                  >
                    +
                  </button>
                </div>

                <p className="w-24 text-right font-mono text-sm font-semibold text-ink">
                  {formatPrice(parseFloat(item.product.price) * item.quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => remove(item)}
                  disabled={busyId === item.id}
                  className="text-berry-dark hover:text-berry disabled:opacity-50"
                  aria-label={`Remove ${item.product.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
              {i < items.length - 1 ? <hr className="tear-rule mx-5" /> : null}
            </li>
          ))}
        </ul>

        <hr className="tear-rule" />
        <div className="flex items-center justify-between p-5">
          <span className="font-medium text-ink">Subtotal</span>
          <span className="font-mono text-lg font-semibold text-ink">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="rounded-md bg-ink px-6 py-3 font-medium text-paper hover:bg-ink-soft"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  )
}
