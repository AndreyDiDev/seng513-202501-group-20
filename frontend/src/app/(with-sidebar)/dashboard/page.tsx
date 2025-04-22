"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock user data
const mockUser = {
  name: "Juanito Escobar",
  email: "escobar@example.com",
  isPremium: false,
}

export default function Dashboard() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode] = useState(true)

  // Logout function
  const handleLogout = () => {
    router.push("/login")
  }

  // Dashboard panels data
  const dashboardPanels = [
    {
      id: "ingredients",
      title: "Ingredients",
      description: "Manage your ingredients and see matching recipes",
      icon: (
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
      ),
      stats: "24 ingredients available",
      link: "/ingredients",
      color: "from-emerald-600 to-emerald-800",
    },
    {
      id: "recipes",
      title: "Recipe Database",
      description: "Browse, search and filter recipes",
      icon: (
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
          className="h-8 w-8 text-blue-400"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      stats: "120+ recipes",
      link: "/recipes",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "submit recipe",
      title: "Submit Recipe",
      description: "Submit a recipe to our database",
      icon: (
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
          className="h-8 w-8 text-purple-400"
        >
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
          <line x1="6" x2="18" y1="17" y2="17" />
        </svg>
      ),
      stats: "Create custom meal plans",
      link: "/submit",
      color: "from-purple-600 to-purple-800",
    },
    {
      id: "forum",
      title: "Recipe Forum",
      description: "Join discussions about recipes and cooking",
      icon: (
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
          className="h-8 w-8 text-amber-400"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      stats: "Join the community",
      link: "/forum",
      color: "from-amber-600 to-amber-800",
    },
    {
      id: "planner",
      title: "Meal Planner",
      description: "Plan your weekly meals efficiently",
      icon: (
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
          className="h-8 w-8 text-green-400"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      stats: "Create and manage meal plans",
      link: "/planner",
      color: "from-green-500 to-green-700",
    },    
    {
      id: "account",
      title: "Account Settings",
      description: "Manage your profile and preferences",
      icon: (
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
          className="h-8 w-8 text-gray-400"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      stats: "Update your profile",
      link: "/account",
      color: "from-gray-600 to-gray-800",
    },
  ]

  return (
    <>
      <div className="flex h-screen bg-gray-900">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center bg-gray-800 px-4 shadow-md lg:hidden">
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
          <div className="ml-4 flex items-center">
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

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
          {/* Content header */}
          <header className="flex h-16 items-center justify-between border-b border-gray-700 bg-gray-800 px-6">
            <h1 className="text-lg font-semibold text-gray-100">Dashboard Overview</h1>
          </header>

          {/* Content body */}
          <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Welcome back, {mockUser.name}</h2>
              <p className="text-gray-400">Here's an overview of your meal planning activities</p>
            </div>

            {/* Dashboard panels */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {dashboardPanels.map((panel) => (
                <Link key={panel.id} href={panel.link} className="block transform transition-all hover:scale-105">
                  <div className={`h-full rounded-lg bg-gradient-to-br ${panel.color} p-6 shadow-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{panel.title}</h3>
                      {panel.icon}
                    </div>
                    <p className="mt-2 text-sm text-gray-100">{panel.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">{panel.stats}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
