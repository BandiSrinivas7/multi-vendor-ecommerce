import { client } from './client'

export function getSellerProfile() {
  return client.get('/seller/profile').then((r) => r.data)
}

export function createSellerProfile({ businessName, gstNumber }) {
  return client.post('/seller/profile', { businessName, gstNumber: gstNumber || null }).then((r) => r.data)
}

export function listMyProducts() {
  return client.get('/seller/products').then((r) => r.data)
}

export function createProduct({ name, description, price, categoryId }) {
  return client.post('/seller/products', { name, description, price, categoryId }).then((r) => r.data)
}

export function updateStock(productId, quantity) {
  return client.put(`/seller/products/${productId}/stock`, { quantity }).then((r) => r.data)
}

export function activateProduct(productId) {
  return client.post(`/seller/products/${productId}/activate`).then((r) => r.data)
}
