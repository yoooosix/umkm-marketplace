import { useEffect, useState } from "react"
import AdminLayout from "../../layouts/AdminLayout"
import { useAuth } from "../../context/AuthContext"
import { useProducts } from "../../context/ProductContext"
import { useOrders } from "../../context/OrderContext"
import OrderStatusBadge from "../../components/OrderStatusBadge"
import { formatCurrency } from "../../utils/storage"
const tabs = [
  { id:"overview", label:"Ringkasan", icon:"dashboard" },
  { id:"users",    label:"Pengguna",  icon:"group" },
  { id:"sellers",  label:"Penjual",   icon:"storefront" },
  { id:"products", label:"Produk",    icon:"inventory_2" },
  { id:"orders",   label:"Pesanan",   icon:"receipt_long" },
]
export default function AdminDashboard() {
  const { users, fetchUsers } = useAuth()
  const { products } = useProducts()
  const { orders, fetchOrders } = useOrders()
  const [activeTab, setActiveTab] = useState("overview")
  useEffect(() => { fetchUsers(); fetchOrders() }, [])
  const sellers = users.filter(u=>u.role==="seller")
  const totalRevenue = orders.filter(o=>o.status==="Selesai").reduce((s,o)=>s+o.total,0)
  const stats = [
    { label:"Total Pengguna", value:users.length,    icon:"group" },
    { label:"Total Penjual",  value:sellers.length,  icon:"storefront" },
    { label:"Total Produk",   value:products.length, icon:"inventory_2" },
    { label:"Total Pesanan",  value:orders.length,   icon:"receipt_long" },
  ]
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-emerald-100 mb-8">
        {tabs.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab===tab.id?"border-primary text-primary":"border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>
      {activeTab==="overview"&&(
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s=>(
            <div key={s.label} className="bg-white p-6 rounded-2xl border border-emerald-100 flex flex-col gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">{s.icon}</span>
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-on-surface-variant">{s.label}</span>
            </div>
          ))}
          <div className="col-span-2 lg:col-span-4 bg-primary rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-sm text-white/80">Total Pendapatan Platform (Pesanan Selesai)</span>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
            </div>
            <span className="material-symbols-outlined text-white text-5xl">trending_up</span>
          </div>
        </div>
      )}
      {activeTab==="users"&&(
        <div className="bg-white rounded-2xl border border-emerald-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50"><tr>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant">Nama</th>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant">Email</th>
              <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant">Role</th>
            </tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} className="border-t border-emerald-100">
                  <td className="px-6 py-3 text-sm">{u.name}</td>
                  <td className="px-6 py-3 text-sm text-on-surface-variant">{u.email}</td>
                  <td className="px-6 py-3"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab==="sellers"&&(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map(s=>(
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-emerald-100 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{s.store_name||s.storeName||s.name}</h3>
                  <p className="text-xs text-on-surface-variant">{s.email}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant mt-2 border-t border-emerald-100 pt-2">
                <span>{products.filter(p=>p.sellerId===s.id).length} produk</span>
                <span>{orders.filter(o=>o.sellerId===s.id).length} pesanan</span>
              </div>
            </div>
          ))}
          {sellers.length===0&&<p className="text-on-surface-variant col-span-full text-center py-8">Belum ada penjual terdaftar.</p>}
        </div>
      )}
      {activeTab==="products"&&(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p=>(
            <div key={p.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="p-4 flex flex-col gap-1">
                <h3 className="text-sm font-semibold line-clamp-1">{p.name}</h3>
                <span className="text-xs text-on-surface-variant">{p.sellerName}</span>
                <span className="text-base font-bold text-primary">{formatCurrency(p.price)}</span>
                <span className="text-xs text-on-surface-variant">Stok: {p.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab==="orders"&&(
        <div className="flex flex-col gap-4">
          {orders.map(order=>(
            <div key={order.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 bg-emerald-50/50">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">{order.id}</span>
                  <span className="text-xs text-on-surface-variant">{order.customerName} • {order.date}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="p-6 flex flex-col gap-2">
                {order.items.map(item=>(
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
          {orders.length===0&&<p className="text-on-surface-variant text-center py-8">Belum ada pesanan.</p>}
        </div>
      )}
    </AdminLayout>
  )
}
