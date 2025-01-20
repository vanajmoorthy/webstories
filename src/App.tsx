import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./app/home/page"
import WebstoryPage from "./app/webstory/page"
import LoginPage from "./app/login/page"
import SignUpPage from "./app/signup/page"
import LogoutPage from "./app/logout/page"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AuthProvider } from "@/context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Protect the /webstory route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/webstory" element={<WebstoryPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/logout" element={<LogoutPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
