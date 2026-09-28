import { client } from './client'

export function checkout() {
  // A fresh idempotency key per attempt is fine here since we only ever
  // call this once per user click; it's forwarded in case the backend's
  // idempotency handling is extended later.
  const idem = crypto.randomUUID()
  return client.post('/orders', null, { headers: { 'Idempotency-Key': idem } }).then((r) => r.data)
}

export function listOrders() {
  return client.get('/orders').then((r) => r.data)
}

export function payMockSuccess(orderId) {
  return client.post(`/payments/${orderId}/mock-success`).then((r) => r.data)
}
