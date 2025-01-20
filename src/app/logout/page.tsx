import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

const LogoutPage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout() // Log the user out
    navigate("/login") // Redirect to the login page
  }, [logout, navigate])

  return (
    <div>
      <p>Logging out...</p>
    </div>
  )
}

export default LogoutPage
