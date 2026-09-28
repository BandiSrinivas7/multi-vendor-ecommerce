import { client } from './client'

export function listProducts({ page = 0, size = 12, q } = {}) {
  const params = { page, size }
  if (q) params.q = q
  return client.get('/products', { params }).then((r) => r.data)
}

export function getProduct(id) {
  return client.get(`/products/${id}`).then((r) => r.data)
}

export function listReviews(productId) {
  return client.get(`/products/${productId}/reviews`).then((r) => r.data)
}

export function addReview(productId, { rating, comment }) {
  return client.post(`/products/${productId}/reviews`, { rating, comment }).then((r) => r.data)
}
