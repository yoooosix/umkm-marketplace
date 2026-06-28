import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate("/") }
  const homeLink = !currentUser ? "/" : currentUser.role === "customer" ? "/customer/dashboard" : currentUser.role === "seller" ? "/seller/dashboard" : "/admin/dashboard"
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-10 w-full max-w-screen-xl mx-auto bg-white/80 backdrop-blur shadow-sm h-16 md:h-20">
      <Link to={homeLink} className="text-xl font-bold text-primary">UMKM Lokal</Link>
      <nav className="hidden md:flex items-center gap-6">
        {currentUser?.role === "customer" && <>
          <Link to="/customer/dashboard" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Beranda</Link>
          <Link to="/customer/orders" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Pesanan Saya</Link>
        </>}
        {currentUser?.role === "seller" && <>
          <Link to="/seller/dashboard" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/seller/products" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Produk</Link>
          <Link to="/seller/orders" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Pesanan</Link>
        </>}
        {currentUser?.role === "admin" && <Link to="/admin/dashboard" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Dashboard Admin</Link>}
      </nav>
      <div className="flex items-center gap-4">
        {currentUser?.role === "customer" && (
          <Link to="/customer/cart" className="relative p-2 hover:bg-emerald-50 rounded-full transition-colors">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            {count > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full font-bold">{count}</span>}
          </Link>
        )}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-on-surface-variant">{currentUser.name}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-full text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors">Keluar</button>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-full bg-primary text-white text-sm hover:opacity-90 transition-opacity">Masuk</Link>
        )}
      </div>
    </header>
  )
}
