const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatPrice(value) {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(n)) return '—'
  return currencyFormatter.format(n)
}

// A small set of jewel tones, one per category, so the marketplace reads as
// many independent stalls rather than one uniform product catalog.
const STALL_COLORS = ['marigold', 'teal', 'berry', 'plum']

export function stallColorFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return STALL_COLORS[hash % STALL_COLORS.length]
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

const STATUS_LABELS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived',
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  SUSPENDED: 'Suspended',
  PAYMENT_PENDING: 'Payment pending',
  PAID: 'Paid',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  PAYMENT_FAILED: 'Payment failed',
  ORDER_CANCELLED: 'Cancelled',
}

export function statusLabel(status) {
  return STATUS_LABELS[status] || status
}
