import Navbar from "../components/Navbar"
export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-screen-xl mx-auto w-full px-4 md:px-10 py-8">{children}</main>
    </div>
  )
}
