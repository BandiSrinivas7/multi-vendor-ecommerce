import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../api/client'
import FormField, { inputClass } from '../components/FormField'
import { Spinner } from '../components/Feedback'

export default function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form)
      toast.success('Signed in.')
      navigate(user.role === 'SELLER' && from === '/' ? '/seller' : from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-soft">Sign in to check on your cart, orders, or your stall.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-lg border border-line bg-white p-6">
        <FormField label="Email">
          <input
            type="email"
            required
            autoFocus
            value={form.email}
            onChange={update('email')}
            className={inputClass}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            required
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
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        New to Bazaarly?{' '}
        <Link to="/register" className="font-medium text-ink underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
