import { AuthProvider } from "@/context/AuthContext"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Editor from "./app/editor/page"
import HomePage from "./app/home/page"
//import WebstoryPage from "./app/webstory/page"
import LoginPage from "./app/login/page"
import LogoutPage from "./app/logout/page"
import SignUpPage from "./app/signup/page"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* 
            <Route element={<ProtectedRoute />}>
              <Route path="/webstory" element={<WebstoryPage />} />
            </Route>
          */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/editor/:id" element={<Editor />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/logout" element={<LogoutPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
