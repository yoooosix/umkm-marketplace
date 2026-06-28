import { useMemo, useState } from "react"
import CustomerLayout from "../../layouts/CustomerLayout"
import { useProducts } from "../../context/ProductContext"
import { categories } from "../../data/products"
import ProductCard from "../../components/ProductCard"
const IMG1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCQpXylOxqPHJRTkHeAquMDncGCGReIfhKpqO3jGgYXFB-AZpD96Lkj7lSa9uz7TOa37gtfos5GMgJExqAqa-B_Uxth-l1G5ERI_FAmny_HF386K6IEGGmpvFfcirUQZgSaCBhobfFKvn7bLyZ_lBKeHrcMQUAF6ioKQT-F0kXI1iEizTp027ic6e4eNOA1CfAgwl3rvMhGWnrYbpdok1X_XpCJhdHMBGbylEgMkcMnqodVzZmNK5NhTDQ5zngv_FTysMVN532ME3wJ"
const sortOptions = [
  { value: "default",    label: "Urutan Default" },
  { value: "price_asc",  label: "Harga: Terendah" },
  { value: "price_desc", label: "Harga: Tertinggi" },
  { value: "rating_desc",label: "Rating Tertinggi" },
  { value: "name_asc",   label: "Nama: A–Z" },
]
export default function CustomerDashboard() {
  const { products, loading } = useProducts()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)
  const [sortBy, setSortBy] = useState("default")
  const filtered = useMemo(() => {
    let result = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeCategory ? p.category === activeCategory : true)
    )
    if (sortBy === "price_asc")   result = [...result].sort((a,b) => a.price - b.price)
    if (sortBy === "price_desc")  result = [...result].sort((a,b) => b.price - a.price)
    if (sortBy === "rating_desc") result = [...result].sort((a,b) => b.rating - a.rating)
    if (sortBy === "name_asc")    result = [...result].sort((a,b) => a.name.localeCompare(b.name))
    return result
  }, [products, search, activeCategory, sortBy])
  return (
    <CustomerLayout>
      <div className="hidden md:flex items-center justify-between mt-6">
        <h1 className="text-2xl font-bold">Jelajahi Produk UMKM</h1>
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            placeholder="Cari produk UMKM unggulan..." />
        </div>
      </div>
      <div className="md:hidden mt-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            placeholder="Cari produk..." />
        </div>
      </div>
      <section className="mt-4 relative overflow-hidden rounded-3xl aspect-[21/9] md:aspect-[3/1]">
        <img className="w-full h-full object-cover" src={IMG1} alt="hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 text-white">
          <span className="bg-primary px-3 py-1 rounded-full text-xs w-fit mb-2">Terpopuler Minggu Ini</span>
          <h2 className="text-2xl md:text-4xl font-black mb-2 max-w-lg">Dukung Produk Lokal,<br />Majukan Ekonomi Bangsa.</h2>
        </div>
      </section>
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Kategori Populer</h2>
          {activeCategory && <button onClick={() => setActiveCategory(null)} className="text-sm text-primary hover:underline">Reset Filter</button>}
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
              className="flex flex-col items-center gap-2 min-w-[72px] group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${activeCategory===cat.id?"bg-primary":"bg-white border border-emerald-100 group-hover:bg-primary/10"}`}>
                <span className={`material-symbols-outlined text-2xl ${activeCategory===cat.id?"text-white":"text-primary"}`}>{cat.icon}</span>
              </div>
              <span className="text-xs text-on-surface-variant">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold">{activeCategory ? categories.find(c=>c.id===activeCategory)?.name : "Semua Produk"}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant hidden sm:block">{filtered.length} produk</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">sort</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="py-12 text-center text-on-surface-variant">Memuat produk...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
            <p>Produk tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </CustomerLayout>
  )
}
