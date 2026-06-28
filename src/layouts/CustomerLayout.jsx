import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-screen-xl mx-auto w-full px-4 md:px-10 pb-12">{children}</main>
      <Footer />
    </div>
  )
}
