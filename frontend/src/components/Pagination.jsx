export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const canPrev = page > 0
  const canNext = page < totalPages - 1

  return (
    <div className="flex items-center justify-center gap-3 pt-8">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-40 hover:enabled:border-ink"
      >
        Previous
      </button>
      <span className="font-mono text-sm text-ink-soft">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-40 hover:enabled:border-ink"
      >
        Next
      </button>
    </div>
  )
}
