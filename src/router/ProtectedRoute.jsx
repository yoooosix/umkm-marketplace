import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const fallback = currentUser.role === "customer" ? "/customer/dashboard" : currentUser.role === "seller" ? "/seller/dashboard" : "/admin/dashboard"
    return <Navigate to={fallback} replace />
  }
  return children
}
