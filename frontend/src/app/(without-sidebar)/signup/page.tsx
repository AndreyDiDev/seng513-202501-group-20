"use client"

import type React from "react"

import { useState } from "react"
// import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // send data to the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Format the data for the API
        const   userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }
        
        // Send the data to the API
        const response = await fetch("http://localhost:5003/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Registration failed")
        }

        // Registration successful
        const data = await response.json()
        console.log("Registration successful:", data)

        // Redirect to login page after successful registration
        router.push("/login")
      } catch (error) {
        console.error("Registration error:", error)
        setErrors({
          form: error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <>
      {/* <Head>
        <title>Sign Up - Meal Planner</title>
        <meta name="description" content="Create your meal planner account" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="theme-color" content="#111827" />
      </Head> */}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/30">
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
              <h2 className="text-xl sm:text-2xl font-bold text-white">Create an account</h2>
              <p className="text-xs sm:text-sm text-gray-400">Join Meal Planner to start planning your meals</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full rounded-md bg-gray-800 border ${
                      errors.firstName ? "border-red-500" : "border-gray-700"
                    } px-3 py-2 text-sm placeholder-gray-500 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                  />
                  {errors.firstName && <p className="text-xs text-red-400">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full rounded-md bg-gray-800 border ${
                      errors.lastName ? "border-red-500" : "border-gray-700"
                    } px-3 py-2 text-sm placeholder-gray-500 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                  />
                  {errors.lastName && <p className="text-xs text-red-400">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full rounded-md bg-gray-800 border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } px-3 py-2 text-sm placeholder-gray-500 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-md bg-gray-800 border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } px-3 py-2 text-sm placeholder-gray-500 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                />
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-md bg-gray-800 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-700"
                  } px-3 py-2 text-sm placeholder-gray-500 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>

              {errors.form && (
                <div className="rounded-md bg-red-900/50 border border-red-800 p-3">
                  <p className="text-sm text-red-400">{errors.form}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
              >
                {isSubmitting ? (
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs sm:text-sm">
              <span className="text-gray-400">Already have an account?</span>{" "}
              <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
