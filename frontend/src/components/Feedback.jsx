export function Spinner({ size = 20 }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke="var(--color-line)" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="var(--color-marigold)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-line bg-white">
      <div className="h-1.5 w-full bg-paper-dim" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-16 rounded bg-paper-dim" />
        <div className="h-5 w-4/5 rounded bg-paper-dim" />
        <div className="h-3 w-full rounded bg-paper-dim" />
        <div className="h-5 w-1/3 rounded bg-paper-dim" />
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line bg-white px-6 py-14 text-center">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
