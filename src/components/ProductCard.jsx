import { Link } from "react-router-dom"
import { formatCurrency } from "../utils/storage"
export default function ProductCard({ product }) {
  return (
    <Link to={`/customer/product/${product.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:shadow-md transition-shadow">
      <div className="aspect-square w-full overflow-hidden bg-surface-container">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <span className="text-xs text-on-surface-variant line-clamp-1">{product.sellerName}</span>
        <h3 className="text-sm font-semibold text-on-surface line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-amber-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span>{product.rating}</span>
        </div>
        <span className="text-base font-bold text-primary mt-1">{formatCurrency(product.price)}</span>
      </div>
    </Link>
  )
}
