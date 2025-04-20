"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Head from "next/head"

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?u=alex",
  isPremium: false,
}

// Mock forum categories
const forumCategories = [
  { id: "general", name: "General Discussion", count: 24 },
  { id: "recipes", name: "Recipe Sharing", count: 47 },
  { id: "techniques", name: "Cooking Techniques", count: 18 },
  { id: "ingredients", name: "Ingredient Substitutions", count: 31 },
  { id: "equipment", name: "Kitchen Equipment", count: 12 },
]

// Mock forum threads
const mockThreads = [
  {
    id: 1,
    title: "What's your favorite quick weeknight dinner?",
    author: "CookingEnthusiast",
    authorAvatar: "https://i.pravatar.cc/150?u=cooking",
    category: "recipes",
    replies: 28,
    views: 342,
    lastActivity: "2 hours ago",
    isPinned: true,
    excerpt: "Looking for some inspiration for quick meals that can be prepared in under 30 minutes...",
  },
  {
    id: 2,
    title: "Best way to sharpen kitchen knives?",
    author: "ChefMike",
    authorAvatar: "https://i.pravatar.cc/150?u=mike",
    category: "equipment",
    replies: 15,
    views: 187,
    lastActivity: "5 hours ago",
    isPinned: false,
    excerpt: "I've been using a whetstone but I'm not sure if I'm doing it correctly. Any tips or recommendations?",
  },
  {
    id: 3,
    title: "Vegetarian alternatives to chicken in stir fry",
    author: "VeggieLover",
    authorAvatar: "https://i.pravatar.cc/150?u=veggie",
    category: "ingredients",
    replies: 32,
    views: 410,
    lastActivity: "Yesterday",
    isPinned: false,
    excerpt:
      "I'm trying to reduce my meat consumption and looking for good alternatives to chicken in stir fry dishes...",
  },
  {
    id: 4,
    title: "How to properly caramelize onions?",
    author: "SousChef",
    authorAvatar: "https://i.pravatar.cc/150?u=sous",
    category: "techniques",
    replies: 19,
    views: 256,
    lastActivity: "2 days ago",
    isPinned: false,
    excerpt: "Every time I try to caramelize onions, they either burn or don't get that deep brown color...",
  },
  {
    id: 5,
    title: "Introduce yourself to the community!",
    author: "Admin",
    authorAvatar: "https://i.pravatar.cc/150?u=admin",
    category: "general",
    replies: 124,
    views: 1520,
    lastActivity: "3 days ago",
    isPinned: true,
    excerpt: "Welcome to our cooking community! Tell us a bit about yourself and your cooking journey...",
  },
  {
    id: 6,
    title: "Tips for meal prepping on a budget",
    author: "FrugalFoodie",
    authorAvatar: "https://i.pravatar.cc/150?u=frugal",
    category: "general",
    replies: 45,
    views: 678,
    lastActivity: "4 days ago",
    isPinned: false,
    excerpt: "I'm trying to save money while still eating healthy. Any tips for affordable meal prepping?",
  },
]

export default function ForumPage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent") // recent, popular, replies
  const [isPremium, setIsPremium] = useState(mockUser.isPremium)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showNewThreadForm, setShowNewThreadForm] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadCategory, setNewThreadCategory] = useState("general")
  const [newThreadContent, setNewThreadContent] = useState("")

  // Filter and sort threads
  const filteredThreads = mockThreads
    .filter((thread) => {
      // Filter by category
      const matchesCategory = activeCategory === "all" || thread.category === activeCategory

      // Filter by search term
      const matchesSearch =
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      // Always show pinned threads first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // Then sort by selected criteria
      if (sortBy === "recent") {
        return a.id < b.id ? 1 : -1
      } else if (sortBy === "popular") {
        return b.views - a.views
      } else {
        return b.replies - a.replies
      }
    })

  // Handle premium upgrade
  const handleUpgradeToPremium = async () => {
    setIsUpgrading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success - update premium status
      setIsPremium(true)
      alert("Upgrade successful! You now have premium access.")
    } catch (error) {
      console.error("Error upgrading to premium:", error)
      alert("There was an error processing your upgrade. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  // Handle new thread submission
  const handleSubmitNewThread = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      alert("Please fill in all required fields")
      return
    }

    // TODO: submit this to API
    alert("Thread created successfully!")

    // Reset form and close it
    setNewThreadTitle("")
    setNewThreadCategory("general")
    setNewThreadContent("")
    setShowNewThreadForm(false)
  }

  // Logout function
  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <>
      <Head>
        <title>Recipe Forum - Meal Planner</title>
        <meta name="description" content="Join discussions about recipes and cooking" />
      </Head>

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

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
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
                <img
                  src={mockUser.avatar || "/placeholder.svg"}
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-100">{mockUser.name}</p>
                  <p className="text-xs text-gray-400">{mockUser.email}</p>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-2 rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-300">
                  Free Account
                  <button
                    className="ml-2 text-emerald-400 hover:text-emerald-300"
                    onClick={handleUpgradeToPremium}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? "Processing..." : "Upgrade"}
                  </button>
                </div>
              )}
              {isPremium && (
                <div className="mt-2 rounded-md bg-emerald-900 px-3 py-1 text-xs text-emerald-100">Premium Account</div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ingredients"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14z"></path>
                      <path d="M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                      <path d="M16 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                      <path d="M11 18c-2 0-3-2-3-4s1-4 3-4"></path>
                      <path d="M13 18c2 0 3-2 3-4s-1-4-3-4"></path>
                    </svg>
                    Ingredients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recipes"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      <line x1="8" y1="3" x2="8" y2="7"></line>
                      <line x1="16" y1="3" x2="16" y2="7"></line>
                      <line x1="2" y1="15" x2="10" y2="15"></line>
                    </svg>
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planner"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Meal Planner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/submit"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                    className="mr-3 h-5 w-5"
                  >
                    <path d="M12 5v14"></path>
                    <path d="M5 12h14"></path>
                  </svg>
                    Submit Recipe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forum"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Recipe Forum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Account
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Logout button */}
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
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Content header */}
          <header className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-100">Recipe Forum</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1 pl-8 text-sm text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
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
                  className="absolute left-2 top-1.5 h-4 w-4 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <button
                onClick={() => setShowNewThreadForm(true)}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                New Thread
              </button>
            </div>
          </header>

          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Categories */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full px-4 py-1 text-sm font-medium ${
                  activeCategory === "all" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Categories
              </button>
              {forumCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-4 py-1 text-sm font-medium ${
                    activeCategory === category.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort options */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <button
                  onClick={() => setSortBy("recent")}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    sortBy === "recent" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSortBy("popular")}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    sortBy === "popular" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setSortBy("replies")}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    sortBy === "replies" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Most Replies
                </button>
              </div>
              <div className="text-sm text-gray-400">
                {filteredThreads.length} {filteredThreads.length === 1 ? "thread" : "threads"}
              </div>
            </div>

            {/* Thread list */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`rounded-lg ${
                    thread.isPinned ? "bg-gray-700/50 border border-emerald-600/30" : "bg-gray-800"
                  } p-4 shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <img
                        src={thread.authorAvatar || "/placeholder.svg"}
                        alt={thread.author}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <Link
                          href={`/forum/thread/${thread.id}`}
                          className="text-lg font-medium text-gray-100 hover:text-emerald-400"
                        >
                          {thread.title}
                        </Link>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                          <span>By {thread.author}</span>
                          <span>•</span>
                          <span>{thread.lastActivity}</span>
                          {thread.isPinned && (
                            <>
                              <span>•</span>
                              <span className="flex items-center text-emerald-400">
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
                                  className="mr-1 h-3 w-3"
                                >
                                  <line x1="12" x2="12" y1="17" y2="22" />
                                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                                </svg>
                                Pinned
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-400">
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
                          className="mr-1 h-3 w-3"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {thread.replies} replies
                      </div>
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
                          className="mr-1 h-3 w-3"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {thread.views} views
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">{thread.excerpt}</p>
                  <div className="mt-3 flex justify-between">
                    <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                      {forumCategories.find((cat) => cat.id === thread.category)?.name || thread.category}
                    </span>
                    <Link
                      href={`/forum/thread/${thread.id}`}
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredThreads.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-12 text-center shadow-lg">
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
                  className="h-12 w-12 text-gray-500"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-100">No threads found</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setActiveCategory("all")
                  }}
                  className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="w-full max-w-2xl rounded-md bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-100">Create New Thread</h2>
            <form onSubmit={handleSubmitNewThread}>
              <div className="mb-4">
                <label htmlFor="threadTitle" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="threadTitle"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter thread title"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="threadCategory" className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  id="threadCategory"
                  value={newThreadCategory}
                  onChange={(e) => setNewThreadCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  {forumCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="threadContent" className="block text-sm font-medium text-gray-300">
                  Content
                </label>
                <textarea
                  id="threadContent"
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter your thread content here..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewThreadForm(false)}
                  className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
