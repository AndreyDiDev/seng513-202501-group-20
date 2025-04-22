"use client"

import React from "react"
// import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/app/context/UserContext"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const { updateUser } = useUser()



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    try {
      const response = await fetch("http://localhost:5003/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
  
      if (response.status === 200) {
        await updateUser()
        // Save data to localStorage
        router.push(
          `/dashboard?email=${encodeURIComponent(email)}`
        )
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Something went wrong. Please try again.")
    }
  }  

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/30">
                {/* Chef Hat Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-emerald-400"
                >
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" x2="18" y1="17" y2="17" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-xs sm:text-sm text-gray-400">Sign in to your meal planner account</p>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm placeholder-gray-500 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Sign in
              </button>

            </form>

            <div className="mt-6 text-center text-xs sm:text-sm">
              <span className="text-gray-400">Don&apos;t have an account?</span>{" "}
              <Link href="/signup/" className="font-medium text-emerald-400 hover:text-emerald-300">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
