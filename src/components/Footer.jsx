export default function Footer() {
  return (
    <footer className="mt-12 bg-white/60 border-t border-emerald-100">
      <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xl font-bold text-primary">UMKM Lokal</span>
        <p className="text-sm text-on-surface-variant">&copy; {new Date().getFullYear()} UMKM Lokal. Mendukung produk lokal Indonesia.</p>
      </div>
    </footer>
  )
}
