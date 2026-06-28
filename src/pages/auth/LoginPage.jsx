import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault()
    setError(""); setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    const role = result.user.role
    navigate(role === "customer" ? "/customer/dashboard" : role === "seller" ? "/seller/dashboard" : "/admin/dashboard", { replace: true })
  }
  function quickFill(role) {
    setEmail(role === "admin" ? "admin@gmail.com" : role === "seller" ? "seller@gmail.com" : "customer@gmail.com")
    setPassword("123456")
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-10 max-w-screen-xl mx-auto py-3 bg-white/80 backdrop-blur shadow-sm w-full">
        <Link to="/" className="text-xl font-bold text-primary">UMKM Lokal</Link>
        <Link to="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">Register</Link>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-4xl">storefront</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Masuk ke UMKM Lokal</h1>
            <p className="text-sm text-on-surface-variant">Kelola bisnis lokal Anda dengan mudah</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Alamat Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kata Sandi</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                  <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <span className="material-symbols-outlined">{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
                {loading ? "Memproses..." : <><span>Masuk</span><span className="material-symbols-outlined">login</span></>}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-on-surface-variant mt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">Daftar sekarang</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
