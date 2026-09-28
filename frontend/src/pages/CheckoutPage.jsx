import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { checkout, payMockSuccess } from '../api/orders'
import { getErrorMessage } from '../api/client'
import { formatPrice } from '../utils/format'
import { Spinner, EmptyState } from '../components/Feedback'

export default function CheckoutPage() {
  const { items, subtotal, refresh } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null) // { orderId, amount, status }
  const [placing, setPlacing] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  async function placeOrder() {
    setError('')
    setPlacing(true)
    try {
      const data = await checkout()
      setOrder(data)
      await refresh() // cart is now empty server-side
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place your order.'))
    } finally {
      setPlacing(false)
    }
  }

  async function completePayment() {
    setError('')
    setPaying(true)
    try {
      await payMockSuccess(order.orderId)
      setPaid(true)
      toast.success('Payment complete.')
    } catch (err) {
      setError(getErrorMessage(err, 'Payment could not be completed.'))
    } finally {
      setPaying(false)
    }
  }

  if (!order && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="There's nothing to check out"
          description="Add something to your cart first."
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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl text-ink">Checkout</h1>

      {!order ? (
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Order summary</h2>
          <ul className="mb-4 flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-ink-soft">
                  {item.product.name} <span className="font-mono">× {item.quantity}</span>
                </span>
                <span className="font-mono text-ink">{formatPrice(parseFloat(item.product.price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <hr className="tear-rule mb-4" />
          <div className="mb-6 flex justify-between font-medium">
            <span className="text-ink">Total</span>
            <span className="font-mono text-lg text-ink">{formatPrice(subtotal)}</span>
          </div>

          {error ? <p className="mb-4 rounded-md bg-berry-light px-3 py-2 text-sm text-berry-dark">{error}</p> : null}

          <button
            type="button"
            onClick={placeOrder}
            disabled={placing}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            {placing && <Spinner size={16} />}
            Place order
          </button>
          <p className="mt-3 text-center text-xs text-ink-soft">
            Stock is reserved from each seller the moment you place the order.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-line bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <StepDot done />
            <span className="text-sm text-ink">Order placed</span>
            <span className="h-px flex-1 bg-line" />
            <StepDot done={paid} />
            <span className="text-sm text-ink">Payment</span>
          </div>

          <p className="font-mono text-xs text-ink-soft">Order #{order.orderId.slice(0, 8)}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{formatPrice(order.amount)}</p>

          {error ? <p className="mt-4 rounded-md bg-berry-light px-3 py-2 text-sm text-berry-dark">{error}</p> : null}

          {!paid ? (
            <>
              <p className="mt-4 text-sm text-ink-soft">
                This marketplace uses a simulated payment provider — nothing is charged for real.
              </p>
              <button
                type="button"
                onClick={completePayment}
                disabled={paying}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-marigold px-4 py-3 font-medium text-ink hover:bg-marigold-dark hover:text-paper disabled:opacity-60"
              >
                {paying && <Spinner size={16} />}
                Complete mock payment
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 rounded-md bg-teal-light px-3 py-2 text-sm text-teal-dark">
                Payment received. Your order is confirmed.
              </p>
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="mt-4 w-full rounded-md bg-ink px-4 py-3 font-medium text-paper hover:bg-ink-soft"
              >
                View my orders
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function StepDot({ done }) {
  return (
    <span
      className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
      style={{
        backgroundColor: done ? 'var(--color-teal)' : 'var(--color-paper-dim)',
        color: done ? 'var(--color-paper)' : 'var(--color-ink-soft)',
      }}
    >
      {done ? '✓' : ''}
    </span>
  )
}
