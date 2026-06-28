import { Link, useNavigate } from "react-router-dom"
import CustomerLayout from "../../layouts/CustomerLayout"
import { useCart } from "../../context/CartContext"
import { formatCurrency } from "../../utils/storage"
export default function CartPage() {
  const { cart, removeFromCart, updateQty, total } = useCart()
  const navigate = useNavigate()
  if (cart.length === 0) return (
    <CustomerLayout>
      <div className="py-12 flex flex-col items-center text-center gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">shopping_cart</span>
        <h1 className="text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="text-sm text-on-surface-variant max-w-sm">Sepertinya Anda belum menambahkan produk apapun. Mari mulai belanja!</p>
        <Link to="/customer/dashboard" className="mt-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">Mulai Belanja</Link>
      </div>
    </CustomerLayout>
  )
  return (
    <CustomerLayout>
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-4">
            {cart.map(item => (
              <div key={item.productId} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-emerald-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-semibold line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-on-surface-variant">{item.sellerName}</p>
                  <span className="text-base font-bold text-primary">{formatCurrency(item.price)}</span>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                  <div className="flex items-center border border-emerald-200 rounded-full">
                    <button onClick={() => updateQty(item.productId, item.qty-1)} className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-base">remove</span>
                    </button>
                    <span className="w-7 text-center text-xs font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty+1)} className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 sticky top-24">
              <h2 className="text-sm font-semibold mb-4">Ringkasan Belanja</h2>
              <div className="flex justify-between text-sm text-on-surface-variant mb-2"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
              <div className="flex justify-between text-sm text-on-surface-variant mb-4"><span>Ongkos Kirim</span><span>Gratis</span></div>
              <div className="border-t border-emerald-100 pt-4 flex justify-between items-center mb-6">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>
              <button onClick={() => navigate("/customer/checkout")} className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center gap-2">
                Lanjut ke Checkout<span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
