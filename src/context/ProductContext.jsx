import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../utils/api"
const ProductContext = createContext(null)
function normalize(p) {
  return {
    id: p.id, name: p.name, description: p.description,
    price: parseFloat(p.price), stock: p.stock, category: p.category,
    image: p.image?.startsWith("/uploads/") ? `http://localhost:5000${p.image}` : p.image,
    sellerId: p.seller_id, sellerName: p.store_name || p.seller_name,
    rating: parseFloat(p.rating) || 4.5,
  }
}
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchProducts() }, [])
  async function fetchProducts() {
    try { setLoading(true); const d = await api.get("/products"); setProducts(d.map(normalize)) }
    catch (e) { console.error(e) } finally { setLoading(false) }
  }
  async function addProduct(fd) { const d = await api.postForm("/products", fd); setProducts(p => [normalize(d), ...p]) }
  async function updateProduct(id, fd) { const d = await api.putForm(`/products/${id}`, fd); setProducts(p => p.map(x => x.id === id ? normalize(d) : x)) }
  async function deleteProduct(id) { await api.delete(`/products/${id}`); setProducts(p => p.filter(x => x.id !== id)) }
  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  )
}
export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error("useProducts must be inside ProductProvider")
  return ctx
}
