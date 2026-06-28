import { createContext, useContext, useState } from "react"
import { api } from "../utils/api"
const OrderContext = createContext(null)
function normalize(o) {
  return {
    id: o.id, customerId: o.customer_id, customerName: o.customer_name,
    sellerId: o.seller_id, sellerName: o.store_name || o.seller_name,
    items: (o.items || []).map(i => ({ productId: i.product_id, name: i.name, price: parseFloat(i.price), qty: i.qty, image: i.image })),
    total: parseFloat(o.total), status: o.status, date: o.order_date,
    address: o.address, phone: o.phone, paymentMethod: o.payment_method,
  }
}
export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  async function fetchOrders() {
    if (loading) return
    try { setLoading(true); const d = await api.get("/orders"); setOrders(d.map(normalize)) }
    catch (e) { console.error(e) } finally { setLoading(false) }
  }
  async function placeOrder(payload) {
    const d = await api.post("/orders", payload)
    setOrders(prev => [normalize(d), ...prev])
  }
  async function updateOrderStatus(orderId, status) {
    await api.patch(`/orders/${orderId}/status`, { status })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }
  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder, updateOrderStatus, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  )
}
export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrders must be inside OrderProvider")
  return ctx
}
