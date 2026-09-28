import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../api/client'
import FormField, { inputClass } from '../components/FormField'
import { Spinner } from '../components/Feedback'

export default function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialRole = params.get('role') === 'seller' ? 'SELLER' : 'CUSTOMER'

  const [form, setForm] = useState({ name: '', email: '', password: '', role: initialRole })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    try {
      const user = await register(form)
      toast.success('Account created. Welcome to Bazaarly.')
      navigate(user.role === 'SELLER' ? '/seller' : '/products', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">Shop the market, or open your own stall.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-lg border border-line bg-white p-6">
        <FormField label="I want to">
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'CUSTOMER', label: 'Shop' },
              { value: 'SELLER', label: 'Sell' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
                className={
                  'rounded-md border px-3 py-2 text-sm font-medium ' +
                  (form.role === opt.value
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line bg-white text-ink hover:border-ink')
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Full name">
          <input required value={form.name} onChange={update('name')} className={inputClass} placeholder="Asha Verma" />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className={inputClass}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password" hint="At least 8 characters.">
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update('password')}
            className={inputClass}
            placeholder="••••••••"
          />
        </FormField>

        {error ? <p className="rounded-md bg-berry-light px-3 py-2 text-sm text-berry-dark">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {submitting && <Spinner size={16} />}
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ink underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
