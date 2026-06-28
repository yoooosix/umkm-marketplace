import { NavLink } from "react-router-dom"
const navItems = [
  { to: "/seller/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/seller/products",  label: "Produk",    icon: "inventory_2" },
  { to: "/seller/orders",    label: "Pesanan",   icon: "receipt_long" },
]
export default function SellerSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-emerald-100 bg-white/60 min-h-[calc(100vh-5rem)] py-8 px-4 gap-1">
      {navItems.map(item => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}>
          <span className="material-symbols-outlined">{item.icon}</span>{item.label}
        </NavLink>
      ))}
    </aside>
  )
}
