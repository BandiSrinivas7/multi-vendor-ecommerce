export default function Logo({ dark = false }) {
  const stripeColors = ['var(--color-marigold)', 'var(--color-teal)', 'var(--color-berry)', 'var(--color-plum)']
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-6 w-6 overflow-hidden rounded-sm" aria-hidden="true">
        {stripeColors.map((c) => (
          <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
        ))}
      </span>
      <span
        className="font-display text-xl font-semibold tracking-tight"
        style={{ color: dark ? 'var(--color-paper)' : 'var(--color-ink)' }}
      >
        Bazaarly
      </span>
    </span>
  )
}
