import { createContext, useContext, useState, useEffect } from "react"
import pb from "@/lib/pocketbase"

type UserModel = {
  id: string
  created: string
  updated: string
  email: string
  emailVisibility: boolean
  verified: boolean
  name: string
}

type AuthContextType = {
  user: UserModel | null
  setUser: (user: UserModel | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signUp: (email: string, password: string, confirmPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  login: async () => { },
  logout: () => { },
  signUp: async () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(pb.authStore.model as UserModel | null)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model as UserModel | null)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, confirmPassword: string) => {
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm: confirmPassword,
    })

    await login(email, password)
  }

  const login = async (email: string, password: string) => {
    await pb.collection("users").authWithPassword(email, password)
    setUser(pb.authStore.model as UserModel | null)
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, setUser, login, logout, signUp }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
