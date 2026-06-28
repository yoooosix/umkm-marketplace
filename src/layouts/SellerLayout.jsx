import Navbar from "../components/Navbar"
import SellerSidebar from "../components/SellerSidebar"
export default function SellerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        <SellerSidebar />
        <main className="flex-grow px-4 md:px-8 py-8 min-w-0">{children}</main>
      </div>
    </div>
  )
}
