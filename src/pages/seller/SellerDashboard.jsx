import { useEffect } from "react"
import { Link } from "react-router-dom"
import SellerLayout from "../../layouts/SellerLayout"
import { useAuth } from "../../context/AuthContext"
import { useProducts } from "../../context/ProductContext"
import { useOrders } from "../../context/OrderContext"
import OrderStatusBadge from "../../components/OrderStatusBadge"
import { formatCurrency } from "../../utils/storage"
export default function SellerDashboard() {
  const { currentUser } = useAuth()
  const { products } = useProducts()
  const { orders, fetchOrders } = useOrders()
  useEffect(() => { fetchOrders() }, [])
  const myProducts = products.filter(p => p.sellerId === currentUser.id)
  const myOrders = orders.filter(o => o.sellerId === currentUser.id).sort((a,b) => new Date(b.date)-new Date(a.date))
  const totalRevenue = myOrders.filter(o=>o.status==="Selesai").reduce((s,o)=>s+o.total,0)
  const stats = [
    { label:"Total Produk",          value:myProducts.length,           icon:"inventory_2" },
    { label:"Total Pesanan",         value:myOrders.length,             icon:"receipt_long" },
    { label:"Menunggu Konfirmasi",   value:myOrders.filter(o=>o.status==="Menunggu Konfirmasi").length, icon:"pending_actions" },
    { label:"Pendapatan (Selesai)",  value:formatCurrency(totalRevenue), icon:"payments" },
  ]
  return (
    <SellerLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">Halo, {currentUser.store_name||currentUser.storeName||currentUser.name} 👋</h1>
          <p className="text-sm text-on-surface-variant mt-1">Berikut ringkasan performa toko Anda hari ini.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white p-6 rounded-2xl border border-emerald-100 flex flex-col gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">{s.icon}</span>
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-on-surface-variant">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/seller/products" className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_box</span>Kelola Produk
          </Link>
          <Link to="/seller/orders" className="flex items-center gap-2 border-2 border-primary text-primary px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary/5 active:scale-95 transition-all">
            <span className="material-symbols-outlined">local_shipping</span>Kelola Pesanan
          </Link>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Pesanan Terbaru</h2>
            <Link to="/seller/orders" className="text-sm text-primary hover:underline">Lihat Semua</Link>
          </div>
          {myOrders.length === 0 ? <p className="text-sm text-on-surface-variant py-4">Belum ada pesanan masuk.</p> : (
            <div className="flex flex-col gap-2">
              {myOrders.slice(0,5).map(order => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-sm font-semibold">{order.id}</span>
                    <p className="text-xs text-on-surface-variant">{order.customerName} • {order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  )
}
