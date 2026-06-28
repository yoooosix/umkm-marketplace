import { createContext, useContext, useState } from "react"
import { api } from "../utils/api"
const AuthContext = createContext(null)
function loadUser() {
  try { return JSON.parse(localStorage.getItem("umkm_current_user")) } catch { return null }
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadUser)
  const [users, setUsers] = useState([])
  async function fetchUsers() {
    try { const data = await api.get("/users"); setUsers(data) } catch {}
  }
  async function login(email, password) {
    try {
      const data = await api.post("/auth/login", { email, password })
      localStorage.setItem("umkm_token", data.token)
      localStorage.setItem("umkm_current_user", JSON.stringify(data.user))
      setCurrentUser(data.user)
      return { success: true, user: data.user }
    } catch (err) { return { success: false, message: err.message } }
  }
  async function register({ name, email, password, role, storeName }) {
    try {
      const data = await api.post("/auth/register", { name, email, password, role, store_name: storeName || null })
      localStorage.setItem("umkm_token", data.token)
      localStorage.setItem("umkm_current_user", JSON.stringify(data.user))
      setCurrentUser(data.user)
      return { success: true, user: data.user }
    } catch (err) { return { success: false, message: err.message } }
  }
  function logout() {
    localStorage.removeItem("umkm_token")
    localStorage.removeItem("umkm_current_user")
    setCurrentUser(null)
    setUsers([])
  }
  return (
    <AuthContext.Provider value={{ users, currentUser, login, register, logout, fetchUsers }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
