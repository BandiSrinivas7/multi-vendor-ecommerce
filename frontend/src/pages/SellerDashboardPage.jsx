import { useEffect, useState } from 'react'
import * as sellerApi from '../api/seller'
import { listCategories, createCategory } from '../api/categories'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'
import FormField, { inputClass } from '../components/FormField'
import Badge from '../components/Badge'
import { Spinner, EmptyState } from '../components/Feedback'

export default function SellerDashboardPage() {
  const toast = useToast()
  const [profile, setProfile] = useState(undefined) // undefined = loading, null = none yet
  const [loadError, setLoadError] = useState('')

  function loadProfile() {
    setProfile(undefined)
    sellerApi
      .getSellerProfile()
      .then(setProfile)
      .catch((err) => {
        // A 400/404 here just means the seller hasn't set up their stall yet.
        if (err.response?.status && err.response.status < 500) setProfile(null)
        else setLoadError(getErrorMessage(err, 'Could not load your seller profile.'))
      })
  }

  useEffect(loadProfile, [])

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState title="Something went wrong" description={loadError} />
      </div>
    )
  }

  if (profile === undefined) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    )
  }

  if (profile === null) {
    return <OnboardingForm onCreated={(p) => { setProfile(p); toast.success('Stall created — waiting for approval.') }} />
  }

  return <Dashboard profile={profile} />
}

function OnboardingForm({ onCreated }) {
  const [form, setForm] = useState({ businessName: '', gstNumber: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const profile = await sellerApi.createSellerProfile(form)
      onCreated(profile)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your stall.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl text-ink">Open your stall</h1>
      <p className="mt-1 text-sm text-ink-soft">Tell us a bit about your business to get started.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 rounded-lg border border-line bg-white p-6">
        <FormField label="Business name">
          <input
            required
            value={form.businessName}
            onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
            className={inputClass}
            placeholder="Marigold & Co."
          />
        </FormField>
        <FormField label="GST number" hint="Optional.">
          <input
            value={form.gstNumber}
            onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value }))}
            className={inputClass}
            placeholder="22AAAAA0000A1Z5"
          />
        </FormField>

        {error ? <p className="rounded-md bg-berry-light px-3 py-2 text-sm text-berry-dark">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {submitting && <Spinner size={16} />}
          Create my stall
        </button>
      </form>
    </div>
  )
}

function Dashboard({ profile }) {
  const toast = useToast()
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState([])

  function loadProducts() {
    sellerApi
      .listMyProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
  }

  useEffect(() => {
    loadProducts()
    listCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const approved = profile.status === 'APPROVED'

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-5">
        <div>
          <h1 className="font-display text-2xl text-ink">{profile.businessName}</h1>
          {profile.gstNumber ? <p className="text-xs text-ink-soft">GST: {profile.gstNumber}</p> : null}
        </div>
        <Badge status={profile.status} />
      </div>

      {!approved && (
        <div className="mb-8 rounded-lg border border-marigold bg-marigold-light p-5 text-sm text-marigold-dark">
          <p className="font-medium">Your stall is {profile.status === 'SUSPENDED' ? 'suspended' : 'pending approval'}.</p>
          <p className="mt-1">
            This demo backend approves sellers manually — an administrator updates the seller's status directly in the
            database (see the project README). Once approved, you'll be able to list and activate products.
          </p>
        </div>
      )}

      <NewProductForm categories={categories} setCategories={setCategories} disabled={!approved} onCreated={loadProducts} />

      <h2 className="mb-4 mt-10 font-display text-xl text-ink">My listings</h2>
      {products === null ? (
        <div className="flex justify-center py-10">
          <Spinner size={24} />
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="No listings yet" description="Products you create will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} onChanged={loadProducts} toast={toast} />
          ))}
        </div>
      )}
    </div>
  )
}

function NewProductForm({ categories, setCategories, disabled, onCreated }) {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '' })
  const [newCategory, setNewCategory] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function addCategory() {
    if (!newCategory.trim()) return
    try {
      const cat = await createCategory({ name: newCategory.trim() })
      setCategories((c) => [...c, cat])
      setForm((f) => ({ ...f, categoryId: cat.id }))
      setNewCategory('')
      setAddingCategory(false)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add that category.'))
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.categoryId) {
      setError('Choose or add a category first.')
      return
    }
    setSubmitting(true)
    try {
      await sellerApi.createProduct({ ...form, price: parseFloat(form.price) })
      setForm({ name: '', description: '', price: '', categoryId: form.categoryId })
      toast.success('Listing created as a draft. Add stock, then activate it below.')
      onCreated()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create that listing.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="mb-4 font-display text-xl text-ink">List a new product</h2>
      {disabled && (
        <p className="mb-4 text-sm text-ink-soft">Your stall needs to be approved before you can list products.</p>
      )}
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormField label="Product name">
          <input
            required
            disabled={disabled}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
            placeholder="Hand-thrown ceramic mug"
          />
        </FormField>
        <FormField label="Price (₹)">
          <input
            required
            disabled={disabled}
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className={inputClass}
            placeholder="499.00"
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Category">
            {!addingCategory ? (
              <div className="flex gap-2">
                <select
                  required
                  disabled={disabled}
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className={inputClass + ' flex-1'}
                >
                  <option value="">Choose a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setAddingCategory(true)}
                  className="rounded-md border border-line px-3 text-sm text-ink hover:border-ink disabled:opacity-50"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={inputClass + ' flex-1'}
                  placeholder="e.g. Stationery"
                />
                <button type="button" onClick={addCategory} className="rounded-md bg-ink px-3 text-sm text-paper">
                  Add
                </button>
                <button type="button" onClick={() => setAddingCategory(false)} className="rounded-md border border-line px-3 text-sm text-ink">
                  Cancel
                </button>
              </div>
            )}
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Description" hint="Optional.">
            <textarea
              disabled={disabled}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass}
            />
          </FormField>
        </div>

        {error ? <p className="sm:col-span-2 rounded-md bg-berry-light px-3 py-2 text-sm text-berry-dark">{error}</p> : null}

        <button
          type="submit"
          disabled={disabled || submitting}
          className="flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 font-medium text-paper hover:bg-ink-soft disabled:opacity-60 sm:col-span-2"
        >
          {submitting && <Spinner size={16} />}
          Create listing
        </button>
      </form>
    </div>
  )
}

function ProductRow({ product, onChanged, toast }) {
  const [qty, setQty] = useState('')
  const [savingStock, setSavingStock] = useState(false)
  const [activating, setActivating] = useState(false)

  async function saveStock() {
    if (qty === '' || Number.isNaN(Number(qty))) return
    setSavingStock(true)
    try {
      await sellerApi.updateStock(product.id, parseInt(qty, 10))
      toast.success('Stock updated.')
      setQty('')
      onChanged()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update stock.'))
    } finally {
      setSavingStock(false)
    }
  }

  async function activate() {
    setActivating(true)
    try {
      await sellerApi.activateProduct(product.id)
      toast.success(`${product.name} is now live.`)
      onChanged()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not activate this listing.'))
    } finally {
      setActivating(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-white p-4">
      <div className="min-w-[10rem] flex-1">
        <p className="font-display text-base text-ink">{product.name}</p>
        <p className="font-mono text-sm text-ink-soft">{formatPrice(product.price)}</p>
      </div>
      <Badge status={product.status} />
      <span className="font-mono text-sm text-ink-soft">{product.availableQuantity} in stock</span>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Set stock"
          className="w-24 rounded-md border border-line px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={saveStock}
          disabled={savingStock}
          className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:border-ink disabled:opacity-50"
        >
          Update
        </button>
      </div>

      {product.status === 'DRAFT' && (
        <button
          type="button"
          onClick={activate}
          disabled={activating || product.availableQuantity <= 0}
          title={product.availableQuantity <= 0 ? 'Add stock before activating' : undefined}
          className="rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-50"
        >
          Activate
        </button>
      )}
    </div>
  )
}
