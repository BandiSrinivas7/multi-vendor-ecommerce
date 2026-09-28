export default function FormField({ label, error, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && !error ? <span className="text-xs text-ink-soft">{hint}</span> : null}
      {error ? <span className="text-xs text-berry-dark">{error}</span> : null}
    </label>
  )
}

export const inputClass =
  'rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink'
