const styles = {
  "Menunggu Konfirmasi": "bg-amber-100 text-amber-700",
  "Diproses": "bg-blue-100 text-blue-700",
  "Dikirim": "bg-indigo-100 text-indigo-700",
  "Selesai": "bg-emerald-100 text-emerald-700",
  "Dibatalkan": "bg-red-100 text-red-700",
}
export default function OrderStatusBadge({ status }) {
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>
}
