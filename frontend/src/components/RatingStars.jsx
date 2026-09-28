export default function RatingStars({ value = 0, size = 16, onChange }) {
  const stars = [1, 2, 3, 4, 5]
  const interactive = typeof onChange === 'function'

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : 'img'} aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={interactive ? `Rate ${n} star${n > 1 ? 's' : ''}` : undefined}
          style={{ width: size, height: size, lineHeight: 0 }}
        >
          <svg viewBox="0 0 20 20" width={size} height={size} fill={n <= value ? 'var(--color-marigold)' : 'none'} stroke="var(--color-marigold-dark)" strokeWidth="1">
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
