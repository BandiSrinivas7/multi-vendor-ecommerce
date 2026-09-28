import { client } from './client'

export function getCart() {
  return client.get('/cart').then((r) => r.data)
}

// The backend adds to the existing quantity for a product already in the
// cart rather than replacing it, and there's no "set exact quantity"
// endpoint, so incrementing by 1 is the only supported step.
export function addToCart(productId, quantity = 1) {
  return client.post('/cart/items', { productId, quantity }).then((r) => r.data)
}

export function removeCartItem(itemId) {
  return client.delete(`/cart/items/${itemId}`).then((r) => r.data)
}
