import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { ProductProvider } from "./context/ProductContext"
import { OrderProvider } from "./context/OrderContext"
import ProtectedRoute from "./router/ProtectedRoute"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import CustomerDashboard from "./pages/customer/CustomerDashboard"
import ProductDetailPage from "./pages/customer/ProductDetailPage"
import CartPage from "./pages/customer/CartPage"
import CheckoutPage from "./pages/customer/CheckoutPage"
import OrderHistoryPage from "./pages/customer/OrderHistoryPage"
import SellerDashboard from "./pages/seller/SellerDashboard"
import SellerProducts from "./pages/seller/SellerProducts"
import SellerOrders from "./pages/seller/SellerOrders"
import AdminDashboard from "./pages/admin/AdminDashboard"
export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
                <Route path="/customer/product/:id" element={<ProtectedRoute allowedRoles={["customer"]}><ProductDetailPage /></ProtectedRoute>} />
                <Route path="/customer/cart" element={<ProtectedRoute allowedRoles={["customer"]}><CartPage /></ProtectedRoute>} />
                <Route path="/customer/checkout" element={<ProtectedRoute allowedRoles={["customer"]}><CheckoutPage /></ProtectedRoute>} />
                <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={["customer"]}><OrderHistoryPage /></ProtectedRoute>} />
                <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={["seller"]}><SellerDashboard /></ProtectedRoute>} />
                <Route path="/seller/products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerProducts /></ProtectedRoute>} />
                <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={["seller"]}><SellerOrders /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  )
}
