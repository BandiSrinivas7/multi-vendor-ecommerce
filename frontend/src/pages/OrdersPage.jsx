import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOrders, payMockSuccess } from '../api/orders'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'
import Badge from '../components/Badge'
import { Spinner, EmptyState } from '../components/Feedback'

export default function OrdersPage() {
  const toast = useToast()
  const [orders, setOrders] = useState(null)
  const [payingId, setPayingId] = useState(null)

  function load() {
    listOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
  }

  useEffect(load, [])

  async function pay(order) {
    setPayingId(order.id)
    try {
      await payMockSuccess(order.id)
      toast.success('Payment complete.')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Payment could not be completed.'))
    } finally {
      setPayingId(null)
    }
  }

  if (orders === null) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="No orders yet"
          description="Once you check out, your orders will show up here."
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
      <h1 className="mb-6 font-display text-2xl text-ink">Your orders</h1>

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-ink-soft">Order #{order.id.slice(0, 8)}</p>
                <p className="font-mono text-lg font-semibold text-ink">{formatPrice(order.totalAmount)}</p>
              </div>
              <Badge status={order.status} />
            </div>

            <hr className="tear-rule my-4" />

            <ul className="flex flex-col gap-1.5">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm text-ink-soft">
                  <span>
                    {item.product.name} <span className="font-mono">× {item.quantity}</span>
                  </span>
                  <span className="font-mono">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                </li>
              ))}
            </ul>

            {order.status === 'PAYMENT_PENDING' && (
              <button
                type="button"
                onClick={() => pay(order)}
                disabled={payingId === order.id}
                className="mt-4 flex items-center gap-2 rounded-md bg-marigold px-4 py-2 text-sm font-medium text-ink hover:bg-marigold-dark hover:text-paper disabled:opacity-60"
              >
                {payingId === order.id && <Spinner size={14} />}
                Pay now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
