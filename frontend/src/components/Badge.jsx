import { statusLabel } from '../utils/format'

const TONE_STYLES = {
  teal: { color: 'var(--color-teal-dark)', border: 'var(--color-teal)', bg: 'var(--color-teal-light)' },
  marigold: { color: 'var(--color-marigold-dark)', border: 'var(--color-marigold)', bg: 'var(--color-marigold-light)' },
  berry: { color: 'var(--color-berry-dark)', border: 'var(--color-berry)', bg: 'var(--color-berry-light)' },
  plum: { color: 'var(--color-plum-dark)', border: 'var(--color-plum)', bg: 'var(--color-plum-light)' },
  neutral: { color: 'var(--color-ink-soft)', border: 'var(--color-line)', bg: 'var(--color-paper-dim)' },
}

const STATUS_TONE = {
  ACTIVE: 'teal',
  APPROVED: 'teal',
  PAID: 'teal',
  DELIVERED: 'teal',
  CONFIRMED: 'teal',
  SHIPPED: 'teal',
  DRAFT: 'plum',
  PENDING: 'marigold',
  PAYMENT_PENDING: 'marigold',
  PROCESSING: 'marigold',
  INACTIVE: 'neutral',
  ARCHIVED: 'neutral',
  SUSPENDED: 'berry',
  PAYMENT_FAILED: 'berry',
  ORDER_CANCELLED: 'berry',
}

export default function Badge({ status, tone, children }) {
  const resolvedTone = tone || STATUS_TONE[status] || 'neutral'
  const s = TONE_STYLES[resolvedTone]
  const label = children || statusLabel(status)
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
      style={{ color: s.color, borderColor: s.border, backgroundColor: s.bg }}
    >
      {label}
    </span>
  )
}
