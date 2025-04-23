"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useUser } from "../context/UserContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const isPremium = user?.role === "premium"

  const handleLogout = () => {
    router.push("/login")
  }

  useEffect(() => {
    const closeSidebar = () => setIsMobileMenuOpen(false)
    window.addEventListener("close-sidebar", closeSidebar)
    return () => window.removeEventListener("close-sidebar", closeSidebar)
  }, [])

  if (isLoading) return <div className="text-white p-4">Loading...</div>

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 transform bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-center border-b border-gray-700 px-6">
            <div className="flex items-center">
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
                className="h-6 w-6 text-emerald-400"
              >
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                <line x1="6" x2="18" y1="17" y2="17" />
              </svg>
              <span className="ml-2 text-lg font-bold text-gray-100">Meal Planner</span>
            </div>
          </div>

          {/* User profile */}
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-100">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            {!isPremium && (
              <div className="mt-2 rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-300">
                Free Account
                <button className="ml-2 text-emerald-400 hover:text-emerald-300">Upgrade</button>
              </div>
            )}
            {isPremium && (
              <div className="mt-2 rounded-md bg-emerald-900 px-3 py-1 text-xs text-emerald-100">
                Premium Account
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-2">
              <SidebarLink href="/dashboard" label="Dashboard" icon="home" active={pathname === "/dashboard"} />
              <SidebarLink href="/ingredients" label="Ingredients" icon="bowl" active={pathname === "/ingredients"} />
              <SidebarLink href="/recipes" label="Recipes" icon="book" active={pathname === "/recipes"} />
              <SidebarLink href="/planner" label="Meal Planner" icon="calendar" active={pathname === "/planner"} />
              <SidebarLink href="/submit" label="Submit Recipe" icon="plus" active={pathname === "/submit"} />
              <SidebarLink href="/forum" label="Recipe Forum" icon="chat" active={pathname === "/forum"} />
              <SidebarLink href="/account" label="Account" icon="user" active={pathname === "/account"} />
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
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
                className="mr-2 h-5 w-5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 w-full">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex h-16 items-center bg-gray-800 px-4 shadow-md">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-300 hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 text-lg font-bold text-white">Meal Planner</span>
        </div>

        {/* Main Content */}
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    </div>
  )
}

// SidebarLink component
function SidebarLink({ href, label, icon, active = false }) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)

    // Trigger sidebar close if on mobile
    if (window.innerWidth < 1024) {
      window.dispatchEvent(new Event("close-sidebar"))
    }
  }

  const iconPaths = {
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
    bowl: (
      <>
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5 5 0 0 1 7.08 0A4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" x2="18" y1="17" y2="17" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </>
    ),
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  }

  return (
    <li>
      <a
        href={href}
        onClick={handleClick}
        className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
          active ? "bg-emerald-600 text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-3 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {iconPaths[icon]}
        </svg>
        {label}
      </a>
    </li>
  )
}
