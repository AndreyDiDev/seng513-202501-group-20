"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/app/context/UserContext"

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isUpgrading, setIsUpgrading] = useState(false)
  const { user, isLoading, updateUser } = useUser();
  const [premium, setPremium] = useState(user?.role)
  console.log(user)



  const handleUpgradeToPremium = async () => {
    setIsUpgrading(true)

    try {
      // Make user premium
      const res = await fetch("http://localhost:5003/api/user/makePremium", {
        method: "GET",
        credentials: "include"
      });
      
      if (!res.ok) {
        throw new Error("Failed to make user premium")
      }

      const result = await res.json()
      console.log("User upgraded to premium:", result)
      // Success - update premium status
      // Update user role in context
      await updateUser()
      alert("Upgrade successful! You now have premium access.")
    } catch (error) {
      console.error("Error upgrading user:", error)
    }finally {
      setIsUpgrading(false)
    }
  }

  // Handle form submission
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Profile updated successfully!")
  }
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newsletter: true,
  })
  
  // Handle notification toggle
  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }
  

  // Handle logout
  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="mr-2 rounded-md bg-emerald-600 p-2">
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
                  className="h-5 w-5 text-white"
                >
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" x2="18" y1="17" y2="17" />
                </svg>
              </div>
              <span className="text-xl font-bold">Meal Planner</span>
            </Link>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/recipes" className="text-gray-300 hover:text-white">
              Recipes
            </Link>
            <Link href="/submit" className="text-gray-300 hover:text-white">
              Recipe Form
            </Link>
            <Link href="/forum" className="text-gray-300 hover:text-white">
              Forum
            </Link>
            <Link href="/account" className="font-medium text-emerald-500">
              Account
            </Link>
          </nav>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-lg bg-gray-800 p-6 shadow">
              <div className="mb-6 flex flex-col items-center">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <div className="mt-2">
                  {user?.role === "premium" ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                      Free Account
                    </span>
                  )}
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
                    activeTab === "profile"
                      ? "bg-gray-700 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 h-5 w-5"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
                    activeTab === "settings"
                      ? "bg-gray-700 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
                    activeTab === "billing"
                      ? "bg-gray-700 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 h-5 w-5"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Billing
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
                    activeTab === "notifications"
                      ? "bg-gray-700 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 h-5 w-5"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
                    activeTab === "security"
                      ? "bg-gray-700 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 h-5 w-5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Security
                </button>
              </nav>
            </div>
          </div>

          {/* Content area */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="rounded-lg bg-gray-800 p-6 shadow">
                <h2 className="mb-6 text-xl font-bold">Profile Information</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-6 grid gap-6 md:grid-cols-2">
                    <div>
                      
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Full Name
                      </label>
                      <h3>{user?.name}</h3>
                    </div>
                    <div>

                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email Address
                      </label>
                      <h3>{user?.email}</h3>
                    </div>
                  </div>
                 
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="rounded-lg bg-gray-800 p-6 shadow">
                <h2 className="mb-6 text-xl font-bold">Account Settings</h2>
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-medium">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-400">Use dark theme across the application</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked className="peer sr-only" />
                        <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-gray-400">Select your preferred language</p>
                      </div>
                      <select className="rounded-md border border-gray-700 bg-gray-700 px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Measurement System</p>
                        <p className="text-sm text-gray-400">Choose your preferred units</p>
                      </div>
                      <select className="rounded-md border border-gray-700 bg-gray-700 px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        <option value="metric">Metric (g, ml)</option>
                        <option value="imperial">Imperial (oz, cups)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="rounded-lg bg-gray-800 p-6 shadow">
                <h2 className="mb-6 text-xl font-bold">Billing & Subscription</h2>

                {premium? (
                  <div>
                    <div className="mb-6 rounded-lg bg-emerald-900/30 p-4">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-emerald-600 p-2">
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
                            className="h-6 w-6 text-white"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-emerald-400">Premium Plan Active</h3>
                          <p className="text-sm text-gray-300">Your subscription renews on January 15, 2024</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-4 text-lg font-medium">Premium Benefits</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-5 w-5 text-emerald-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Unlimited recipe uploads</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-5 w-5 text-emerald-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Advanced meal planning tools</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-5 w-5 text-emerald-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Nutritional analysis</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-5 w-5 text-emerald-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Shopping list generation</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-5 w-5 text-emerald-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Ad-free experience</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-4 text-lg font-medium">Payment Method</h3>
                      <div className="flex items-center rounded-md border border-gray-700 bg-gray-700 p-4">
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
                          className="mr-3 h-6 w-6"
                        >
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-400">Expires 12/2025</p>
                        </div>
                        <button className="ml-auto text-sm text-emerald-500 hover:text-emerald-400">Update</button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button className="text-sm text-red-500 hover:text-red-400">Cancel Subscription</button>
                      <button className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500">
                        Manage Subscription
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h3 className="mb-4 text-lg font-medium">Current Plan</h3>
                      <div className="rounded-lg border border-gray-700 p-4">
                        <p className="font-medium">Free Plan</p>
                        <p className="text-sm text-gray-400">Basic features with limited access</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-medium">Upgrade to Premium</h3>
                      <div className="rounded-lg border border-emerald-600 bg-gray-800 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="text-xl font-bold text-emerald-500">Premium Plan</h4>
                          <div>
                            <span className="text-2xl font-bold">$9.99</span>
                            <span className="text-gray-400">/month</span>
                          </div>
                        </div>
                        <ul className="mb-6 space-y-2">
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-5 w-5 text-emerald-500"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Unlimited recipe uploads</span>
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-5 w-5 text-emerald-500"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Advanced meal planning tools</span>
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-5 w-5 text-emerald-500"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Nutritional analysis</span>
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-5 w-5 text-emerald-500"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Shopping list generation</span>
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-5 w-5 text-emerald-500"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Ad-free experience</span>
                          </li>
                        </ul>
                        <button
                          onClick={handleUpgradeToPremium}
                          disabled={isUpgrading}
                          className="w-full rounded-md bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {isUpgrading ? "Processing..." : "Upgrade Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="rounded-lg bg-gray-800 p-6 shadow">
                <h2 className="mb-6 text-xl font-bold">Notification Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Updates</p>
                          <p className="text-sm text-gray-400">Receive updates about your account</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={userData.notifications.email}
                            onChange={() => handleNotificationToggle("email")}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-gray-400">Receive our weekly newsletter</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={userData.notifications.newsletter}
                            onChange={() => handleNotificationToggle("newsletter")}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-400">Receive notifications on your device</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={userData.notifications.push}
                            onChange={() => handleNotificationToggle("push")}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="rounded-lg bg-gray-800 p-6 shadow">
                <h2 className="mb-6 text-xl font-bold">Security Settings</h2>
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-medium">Change Password</h3>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="current-password" className="mb-2 block text-sm font-medium">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-700 p-4">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                      Enable
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium text-red-500">Danger Zone</h3>
                  <div className="rounded-md border border-red-800 bg-red-900/20 p-4">
                    <p className="mb-4 font-medium">Delete Account</p>
                    <p className="mb-4 text-sm text-gray-300">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="rounded-md border border-red-500 bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
