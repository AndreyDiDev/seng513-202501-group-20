"use client"
import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type UserContextType = {
  user: User | null
  isLoading: boolean
  updateUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/me", { credentials: "include" })
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error("Failed to fetch user:", err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const updateUser = async () => {
    const res = await fetch("http://localhost:5003/api/me", { credentials: "include" })
    const data = await res.json()
    setUser(data)
  }

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}
