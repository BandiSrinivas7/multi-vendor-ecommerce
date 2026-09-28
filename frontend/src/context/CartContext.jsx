import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as cartApi from '../api/cart'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      const data = await cartApi.addToCart(productId, quantity)
      setCart(data)
      return data
    },
    []
  )

  const removeItem = useCallback(async (itemId) => {
    await cartApi.removeCartItem(itemId)
    await refresh()
  }, [refresh])

  const { itemCount, subtotal } = useMemo(() => {
    const items = cart?.items || []
    return {
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0),
    }
  }, [cart])

  const value = useMemo(
    () => ({ cart, items: cart?.items || [], loading, itemCount, subtotal, refresh, addItem, removeItem }),
    [cart, loading, itemCount, subtotal, refresh, addItem, removeItem]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
