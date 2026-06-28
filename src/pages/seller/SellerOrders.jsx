import { useEffect, useState } from "react"
import SellerLayout from "../../layouts/SellerLayout"
import { useAuth } from "../../context/AuthContext"
import { useOrders } from "../../context/OrderContext"
import OrderStatusBadge from "../../components/OrderStatusBadge"
import { formatCurrency } from "../../utils/storage"
const statusFlow = ["Menunggu Konfirmasi","Diproses","Dikirim","Selesai"]
export default function SellerOrders() {
  const { currentUser } = useAuth()
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrders()
  const [filterStatus, setFilterStatus] = useState("Semua")
  useEffect(() => { fetchOrders() }, [])
  const myOrders = orders.filter(o=>o.sellerId===currentUser.id).filter(o=>filterStatus==="Semua"||o.status===filterStatus).sort((a,b)=>new Date(b.date)-new Date(a.date))
  function nextStatus(cur) { const i=statusFlow.indexOf(cur); return i===-1||i===statusFlow.length-1?null:statusFlow[i+1] }
  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Pesanan Masuk</h1>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-4 py-2 bg-white border border-emerald-100 rounded-lg text-sm outline-none">
          <option value="Semua">Semua Status</option>
          {[...statusFlow,"Dibatalkan"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div className="py-12 text-center text-on-surface-variant">Memuat pesanan...</div>
      : myOrders.length===0 ? (
        <div className="py-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-2">receipt_long</span>
          <p>Belum ada pesanan untuk status ini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myOrders.map(order => {
            const next=nextStatus(order.status)
            return (
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
                  <div className="border-t border-emerald-100 mt-2 pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-on-surface-variant"><p>{order.address}</p><p>{order.paymentMethod}</p></div>
                    <span className="text-base font-bold text-primary">{formatCurrency(order.total)}</span>
                  </div>
                  {order.status!=="Selesai"&&order.status!=="Dibatalkan"&&(
                    <div className="flex gap-2 mt-3">
                      {next&&<button onClick={()=>updateOrderStatus(order.id,next)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-base">arrow_forward</span>Ubah ke "{next}"
                      </button>}
                      <button onClick={()=>updateOrderStatus(order.id,"Dibatalkan")} className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-50 active:scale-95 transition-all">Batalkan</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </SellerLayout>
  )
}
