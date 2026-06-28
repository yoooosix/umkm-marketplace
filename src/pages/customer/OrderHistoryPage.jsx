import { useEffect } from "react"
import { Link } from "react-router-dom"
import CustomerLayout from "../../layouts/CustomerLayout"
import { useAuth } from "../../context/AuthContext"
import { useOrders } from "../../context/OrderContext"
import OrderStatusBadge from "../../components/OrderStatusBadge"
import { formatCurrency } from "../../utils/storage"
export default function OrderHistoryPage() {
  const { currentUser } = useAuth()
  const { orders, loading, fetchOrders } = useOrders()
  useEffect(() => { fetchOrders() }, [])
  const myOrders = orders.filter(o => o.customerId === currentUser.id).sort((a,b) => new Date(b.date)-new Date(a.date))
  if (loading) return <CustomerLayout><div className="py-12 text-center text-on-surface-variant">Memuat pesanan...</div></CustomerLayout>
  if (myOrders.length === 0) return (
    <CustomerLayout>
      <div className="py-12 flex flex-col items-center text-center gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">receipt_long</span>
        <h1 className="text-2xl font-bold">Belum Ada Pesanan</h1>
        <p className="text-sm text-on-surface-variant max-w-sm">Riwayat pesanan Anda akan muncul di sini setelah Anda melakukan checkout.</p>
        <Link to="/customer/dashboard" className="mt-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">Mulai Belanja</Link>
      </div>
    </CustomerLayout>
  )
  return (
    <CustomerLayout>
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>
        <div className="flex flex-col gap-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 bg-emerald-50/50">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">{order.id}</span>
                  <span className="text-xs text-on-surface-variant">{order.date}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="p-6 flex flex-col gap-2">
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">{item.name} x{item.qty}</span>
                    <span>{formatCurrency(item.price*item.qty)}</span>
                  </div>
                ))}
                <div className="border-t border-emerald-100 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">{order.paymentMethod}</span>
                  <span className="text-base font-bold text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  )
}
