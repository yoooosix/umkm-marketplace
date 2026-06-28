import { useState } from "react"
import SellerLayout from "../../layouts/SellerLayout"
import { useAuth } from "../../context/AuthContext"
import { useProducts } from "../../context/ProductContext"
import { categories } from "../../data/products"
import { formatCurrency } from "../../utils/storage"
const emptyForm = { name:"", description:"", price:"", stock:"", category:categories[0].id, image_url:"" }
export default function SellerProducts() {
  const { currentUser } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const myProducts = products.filter(p => p.sellerId === currentUser.id)
  function openAdd() { setForm(emptyForm); setEditingId(null); setImageFile(null); setImagePreview(null); setError(""); setShowModal(true) }
  function openEdit(p) {
    setForm({ name:p.name, description:p.description, price:p.price, stock:p.stock, category:p.category, image_url:p.image?.startsWith("http://localhost")?"":p.image||"" })
    setEditingId(p.id); setImageFile(null); setImagePreview(p.image||null); setError(""); setShowModal(true)
  }
  function handleChange(e) { const{name,value}=e.target; setForm(p=>({...p,[name]:value})) }
  function handleImageChange(e) {
    const file=e.target.files[0]; if(!file) return
    setImageFile(file); setImagePreview(URL.createObjectURL(file)); setForm(p=>({...p,image_url:""}))
  }
  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const fd = new FormData()
      fd.append("name",form.name); fd.append("description",form.description)
      fd.append("price",form.price); fd.append("stock",form.stock); fd.append("category",form.category)
      if (imageFile) fd.append("image",imageFile)
      else if (form.image_url) fd.append("image_url",form.image_url)
      if (editingId) await updateProduct(editingId,fd)
      else await addProduct(fd)
      setShowModal(false)
    } catch(err) { setError(err.message||"Gagal menyimpan produk.") }
    finally { setLoading(false) }
  }
  async function handleDelete(id) { try { await deleteProduct(id); setConfirmDeleteId(null) } catch(err) { alert(err.message) } }
  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produk Saya</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>Tambah Produk
        </button>
      </div>
      {myProducts.length === 0 ? (
        <div className="py-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
          <p>Belum ada produk. Tambahkan produk pertama Anda!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-surface-container">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-1 flex-grow">
                <h3 className="text-sm font-semibold line-clamp-1">{p.name}</h3>
                <span className="text-base font-bold text-primary">{formatCurrency(p.price)}</span>
                <span className="text-xs text-on-surface-variant">Stok: {p.stock}</span>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>openEdit(p)} className="flex-1 flex items-center justify-center gap-1 border border-gray-200 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-base">edit</span>Edit
                  </button>
                  {confirmDeleteId===p.id ? (
                    <button onClick={()=>handleDelete(p.id)} className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-lg text-xs font-medium">Yakin Hapus?</button>
                  ) : (
                    <button onClick={()=>setConfirmDeleteId(p.id)} className="flex-1 flex items-center justify-center gap-1 border border-red-200 text-red-500 py-2 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editingId?"Edit Produk":"Tambah Produk"}</h2>
              <button onClick={()=>setShowModal(false)} className="text-on-surface-variant hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
              {imagePreview && <div className="aspect-video w-full rounded-xl overflow-hidden bg-surface-container"><img src={imagePreview} alt="preview" className="w-full h-full object-cover" /></div>}
              <div>
                <label className="block text-sm font-medium mb-1">Upload Gambar</label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full text-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:opacity-90" />
                <p className="text-xs text-on-surface-variant mt-1">Maks. 5MB. JPG, PNG, WEBP.</p>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <div className="flex-1 h-px bg-gray-200" /><span className="text-xs">atau pakai URL</span><div className="flex-1 h-px bg-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Gambar</label>
                <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Produk</label>
                <input name="name" required value={form.name} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="description" required rows={3} value={form.description} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                  <input type="number" name="price" required min="0" value={form.price} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
                <div><label className="block text-sm font-medium mb-1">Stok</label>
                  <input type="number" name="stock" required min="0" value={form.stock} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all mt-2 disabled:opacity-60">
                {loading?"Menyimpan...":editingId?"Simpan Perubahan":"Tambah Produk"}
              </button>
            </form>
          </div>
        </div>
      )}
    </SellerLayout>
  )
}
