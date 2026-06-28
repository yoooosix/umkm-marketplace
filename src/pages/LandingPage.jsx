import { Link } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { useAuth } from "../context/AuthContext"
import { useProducts } from "../context/ProductContext"
import { categories } from "../data/products"
import { formatCurrency } from "../utils/storage"
const IMG1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCQpXylOxqPHJRTkHeAquMDncGCGReIfhKpqO3jGgYXFB-AZpD96Lkj7lSa9uz7TOa37gtfos5GMgJExqAqa-B_Uxth-l1G5ERI_FAmny_HF386K6IEGGmpvFfcirUQZgSaCBhobfFKvn7bLyZ_lBKeHrcMQUAF6ioKQT-F0kXI1iEizTp027ic6e4eNOA1CfAgwl3rvMhGWnrYbpdok1X_XpCJhdHMBGbylEgMkcMnqodVzZmNK5NhTDQ5zngv_FTysMVN532ME3wJ"
export default function LandingPage() {
  const { currentUser } = useAuth()
  const { products } = useProducts()
  const exploreLink = currentUser?.role === "customer" ? "/customer/dashboard" : "/login"
  return (
    <MainLayout>
      <section className="max-w-screen-xl mx-auto px-4 md:px-10 mt-4">
        <div className="relative overflow-hidden rounded-3xl aspect-[16/9] md:aspect-[3/1]">
          <img className="w-full h-full object-cover" src={IMG1} alt="hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 text-white">
            <span className="bg-primary px-3 py-1 rounded-full text-xs w-fit mb-2">Terpopuler Minggu Ini</span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 max-w-lg">Dukung Produk Lokal, Majukan Ekonomi Bangsa.</h1>
            <p className="text-sm mb-6 opacity-90 max-w-md">Temukan ribuan produk kurasi dari UMKM terbaik di seluruh pelosok Indonesia.</p>
            <Link to={exploreLink} className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold w-fit hover:opacity-90 active:scale-95 transition-all">Jelajahi Sekarang</Link>
          </div>
        </div>
      </section>
      <section className="max-w-screen-xl mx-auto px-4 md:px-10 mt-10">
        <h2 className="text-2xl font-bold mb-6">Kategori Populer</h2>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center group-hover:bg-primary/10 transition-all shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl">{cat.icon}</span>
              </div>
              <span className="text-xs text-on-surface-variant">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-screen-xl mx-auto px-4 md:px-10 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Produk Unggulan</h2>
          <Link to={exploreLink} className="text-sm text-primary hover:underline">Lihat Semua</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0,4).map(p => (
            <Link key={p.id} to={exploreLink} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="aspect-square w-full overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
              <div className="p-3 flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant line-clamp-1">{p.sellerName}</span>
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{p.name}</h3>
                <span className="text-base font-bold text-primary">{formatCurrency(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-screen-xl mx-auto px-4 md:px-10 mt-12 mb-12">
        <div className="bg-primary rounded-3xl px-8 py-12 text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Punya Usaha UMKM?</h2>
          <p className="text-sm text-white/90 max-w-lg">Bergabunglah sebagai penjual dan jangkau lebih banyak pelanggan di seluruh Indonesia.</p>
          <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95">Daftar Sebagai Penjual</Link>
        </div>
      </section>
    </MainLayout>
  )
}
