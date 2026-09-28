import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)
let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (message, tone = 'ink') => {
      const id = nextId++
      setToasts((t) => [...t, { id, message, tone }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss]
  )

  const api = useMemo(
    () => ({
      success: (m) => push(m, 'teal'),
      error: (m) => push(m, 'berry'),
      info: (m) => push(m, 'ink'),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-[toast-in_0.18s_ease-out] rounded-md border-l-4 bg-ink px-4 py-3 text-sm text-paper shadow-lg"
            style={{ borderColor: `var(--color-${t.tone})` }}
          >
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
