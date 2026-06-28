import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import CustomerLayout from "../../layouts/CustomerLayout"
import { useProducts } from "../../context/ProductContext"
import { useCart } from "../../context/CartContext"
import { formatCurrency } from "../../utils/storage"
export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const product = products.find(p => p.id === id)
  if (!product) return (
    <CustomerLayout>
      <div className="py-12 text-center"><p className="text-on-surface-variant mb-4">Produk tidak ditemukan.</p>
        <Link to="/customer/dashboard" className="text-primary hover:underline">Kembali ke beranda</Link></div>
    </CustomerLayout>
  )
  function handleAddToCart() { addToCart(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1500) }
  function handleBuyNow() { addToCart(product, qty); navigate("/customer/cart") }
  return (
    <CustomerLayout>
      <div className="mt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-sm mb-6 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>Kembali
        </button>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl overflow-hidden bg-surface-container aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-sm text-primary font-semibold">{product.sellerName}</span>
              <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-amber-500 text-lg" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                <span className="text-sm text-on-surface-variant">{product.rating} • Stok {product.stock}</span>
              </div>
            </div>
            <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
            <div className="border-t border-emerald-100 pt-5">
              <h2 className="text-sm font-semibold mb-2">Deskripsi Produk</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{product.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Jumlah</span>
              <div className="flex items-center border border-emerald-200 rounded-full">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock,q+1))} className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-full text-sm font-semibold hover:bg-primary/5 transition-colors active:scale-95">
                <span className="material-symbols-outlined">shopping_cart</span>
                {added ? "Ditambahkan!" : "Tambah ke Keranjang"}
              </button>
              <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95">
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
