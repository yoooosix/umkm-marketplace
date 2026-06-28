import { createContext, useContext, useEffect, useState } from "react"
const CartContext = createContext(null)
function load() { try { return JSON.parse(localStorage.getItem("umkm_cart")) || [] } catch { return [] } }
export function CartProvider({ children }) {
  const [cart, setCart] = useState(load)
  useEffect(() => { localStorage.setItem("umkm_cart", JSON.stringify(cart)) }, [cart])
  function addToCart(product, qty = 1) {
    setCart(prev => {
      const ex = prev.find(i => i.productId === product.id)
      if (ex) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { productId: product.id, name: product.name, price: product.price, image: product.image, sellerId: product.sellerId, sellerName: product.sellerName, qty }]
    })
  }
  function removeFromCart(productId) { setCart(prev => prev.filter(i => i.productId !== productId)) }
  function updateQty(productId, qty) { if (qty < 1) return; setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i)) }
  function clearCart() { setCart([]) }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const count = cart.reduce((s, i) => s + i.qty, 0)
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}
