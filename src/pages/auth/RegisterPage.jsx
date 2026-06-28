import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"", role:"customer", storeName:"" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  function handleChange(e) { const {name,value}=e.target; setForm(p=>({...p,[name]:value})) }
  async function handleSubmit(e) {
    e.preventDefault(); setError("")
    if (form.password !== form.confirmPassword) { setError("Konfirmasi kata sandi tidak cocok."); return }
    if (form.password.length < 6) { setError("Kata sandi minimal 6 karakter."); return }
    setLoading(true)
    const result = await register(form)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    const role = result.user.role
    navigate(role === "customer" ? "/customer/dashboard" : role === "seller" ? "/seller/dashboard" : "/admin/dashboard", { replace: true })
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-10 max-w-screen-xl mx-auto py-3 bg-white/80 backdrop-blur shadow-sm w-full">
        <Link to="/" className="text-xl font-bold text-primary">UMKM Lokal</Link>
        <Link to="/login" className="text-sm text-primary hover:underline">Sudah punya akun? Masuk</Link>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-4xl">person_add</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Buat Akun Baru</h1>
            <p className="text-sm text-on-surface-variant">Gabung dan dukung produk lokal Indonesia</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Daftar Sebagai</label>
                <div className="grid grid-cols-2 gap-2">
                  {["customer","seller"].map(r => (
                    <button key={r} type="button" onClick={() => setForm(f=>({...f,role:r}))}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all ${form.role===r?"border-primary bg-primary/10 text-primary":"border-gray-200 text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-[18px]">{r==="customer"?"shopping_bag":"storefront"}</span>
                      {r==="customer"?"Pembeli":"Penjual"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="Nama Anda"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              {form.role==="seller" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Toko</label>
                  <input name="storeName" required value={form.storeName} onChange={handleChange} placeholder="Nama toko Anda"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Alamat Email</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="nama@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kata Sandi</label>
                <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konfirmasi Kata Sandi</label>
                <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="Ulangi kata sandi"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
                {loading ? "Mendaftar..." : <><span>Daftar</span><span className="material-symbols-outlined">arrow_forward</span></>}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-on-surface-variant mt-4">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">Masuk di sini</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
