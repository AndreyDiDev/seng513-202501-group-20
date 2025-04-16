"use client"

import type React from "react"
import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLoginPage() {
const router = useRouter()
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [adminCode, setAdminCode] = useState("")
const [error, setError] = useState("")
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setIsLoading(true)

  // TODO: validate against backend
  setTimeout(() => {
    if (email === "admin@example.com" && password === "admin123" && adminCode === "MEAL-ADMIN-2023") {
      router.push("/admin/page")
    } else {
      setError("Invalid credentials. Please check your email, password, and admin code.")
    }
    setIsLoading(false)
  }, 1000)
}

return (
  <>
    <Head>
      <title>Admin Login - Meal Planner</title>
      <meta name="description" content="Admin login for Meal Planner" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <meta name="theme-color" content="#111827" />
    </Head>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
        <div className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-900/30">
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
                className="h-8 w-8 text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">Admin Login</h2>
            <p className="text-xs sm:text-sm text-gray-400">Access the Meal Planner admin panel</p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-900/30 border border-red-800 p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-300">
                Admin Code
              </label>
              <input
                id="adminCode"
                type="text"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin code"
                required
                className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login to Admin Panel"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs sm:text-sm">
            <Link href="/login/page" className="font-medium text-red-400 hover:text-red-300">
              Return to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
)
}
