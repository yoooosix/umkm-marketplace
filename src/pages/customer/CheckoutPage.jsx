import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import CustomerLayout from "../../layouts/CustomerLayout"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useOrders } from "../../context/OrderContext"
import { formatCurrency } from "../../utils/storage"
const paymentMethods = [
  { id: "transfer", label: "Transfer Bank",       icon: "account_balance" },
  { id: "ewallet",  label: "E-Wallet",            icon: "account_balance_wallet" },
  { id: "cod",      label: "Bayar di Tempat (COD)",icon: "payments" },
]
export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const { currentUser } = useAuth()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [payment, setPayment] = useState("transfer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  if (cart.length === 0) return <Navigate to="/customer/cart" replace />
  async function handlePlaceOrder(e) {
    e.preventDefault()
    if (!address.trim() || !phone.trim()) { setError("Mohon lengkapi alamat dan nomor telepon."); return }
    setError(""); setLoading(true)
    try {
      const groups = cart.reduce((acc, item) => { acc[item.sellerId] = acc[item.sellerId] || []; acc[item.sellerId].push(item); return acc }, {})
      for (const [seller_id, items] of Object.entries(groups)) {
        await placeOrder({
          seller_id, items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty, image: i.image || "" })),
          total: items.reduce((s,i) => s+i.price*i.qty, 0),
          address, phone, payment_method: paymentMethods.find(p=>p.id===payment)?.label || payment,
        })
      }
      clearCart(); navigate("/customer/orders", { replace: true })
    } catch (err) { setError(err.message || "Gagal membuat pesanan.") }
    finally { setLoading(false) }
  }
  return (
    <CustomerLayout>
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-4">
            {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
            <div className="bg-white p-6 rounded-2xl border border-emerald-100">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">location_on</span>Alamat Pengiriman</h2>
              <div className="flex flex-col gap-3">
                <div><label className="block text-sm font-medium mb-1">Nama Penerima</label>
                  <input value={currentUser?.name||""} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-on-surface-variant" /></div>
                <div><label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
                <div><label className="block text-sm font-medium mb-1">Alamat Lengkap</label>
                  <textarea value={address} onChange={e=>setAddress(e.target.value)} rows={3} placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" /></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-100">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">credit_card</span>Metode Pembayaran</h2>
              <div className="flex flex-col gap-2">
                {paymentMethods.map(m => (
                  <label key={m.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${payment===m.id?"border-primary bg-primary/5":"border-gray-200 hover:bg-gray-50"}`}>
                    <input type="radio" name="payment" checked={payment===m.id} onChange={()=>setPayment(m.id)} className="text-primary" />
                    <span className="material-symbols-outlined text-primary">{m.icon}</span>
                    <span className="text-sm">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 sticky top-24">
              <h2 className="text-sm font-semibold mb-4">Ringkasan Pesanan</h2>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-xs">
                    <span className="text-on-surface-variant line-clamp-1 pr-2">{item.name} x{item.qty}</span>
                    <span className="shrink-0">{formatCurrency(item.price*item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-emerald-100 pt-4 flex justify-between items-center mb-6">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? "Memproses..." : <><span>Buat Pesanan</span><span className="material-symbols-outlined">check_circle</span></>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  )
}
