import { useEffect, useState } from 'react'
import {
  getSellers,
  approveSeller,
  suspendSeller,
} from '../api/admin'
import { getErrorMessage } from '../api/client'

export default function AdminDashboardPage() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [error, setError] = useState('')

  async function loadSellers() {
    try {
      setError('')
      setLoading(true)

      const data = await getSellers()
      setSellers(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load sellers.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSellers()
  }, [])

  async function handleApprove(id) {
    try {
      setError('')
      setActionId(id)

      const updatedSeller = await approveSeller(id)

      setSellers((current) =>
        current.map((seller) =>
          seller.id === updatedSeller.id ? updatedSeller : seller
        )
      )
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to approve seller.'))
    } finally {
      setActionId(null)
    }
  }

  async function handleSuspend(id) {
    try {
      setError('')
      setActionId(id)

      const updatedSeller = await suspendSeller(id)

      setSellers((current) =>
        current.map((seller) =>
          seller.id === updatedSeller.id ? updatedSeller : seller
        )
      )
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to suspend seller.'))
    } finally {
      setActionId(null)
    }
  }

  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.35rem' }}>Admin Dashboard</h1>
          <p style={{ margin: 0 }}>
            Manage seller registrations and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSellers}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: '1rem',
            padding: '0.85rem 1rem',
            border: '1px solid #dc2626',
            borderRadius: '8px',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading sellers...</p>
      ) : sellers.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '10px',
          }}
        >
          <h2 style={{ marginTop: 0 }}>No sellers found</h2>
          <p style={{ marginBottom: 0 }}>
            Seller registrations will appear here.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '700px',
            }}
          >
            <thead>
              <tr>
                <th style={cellStyle}>Business</th>
                <th style={cellStyle}>GST Number</th>
                <th style={cellStyle}>Status</th>
                <th style={cellStyle}>Created</th>
                <th style={cellStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id}>
                  <td style={cellStyle}>
                    <strong>{seller.businessName}</strong>
                  </td>

                  <td style={cellStyle}>
                    {seller.gstNumber || '—'}
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {seller.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {seller.createdAt
                      ? new Date(seller.createdAt).toLocaleString()
                      : '—'}
                  </td>

                  <td style={cellStyle}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleApprove(seller.id)}
                        disabled={
                          actionId === seller.id ||
                          seller.status === 'APPROVED'
                        }
                      >
                        {actionId === seller.id
                          ? 'Working...'
                          : 'Approve'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSuspend(seller.id)}
                        disabled={
                          actionId === seller.id ||
                          seller.status === 'SUSPENDED'
                        }
                      >
                        {actionId === seller.id
                          ? 'Working...'
                          : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

const cellStyle = {
  textAlign: 'left',
  padding: '0.85rem',
  borderBottom: '1px solid #ddd',
  verticalAlign: 'middle',
}